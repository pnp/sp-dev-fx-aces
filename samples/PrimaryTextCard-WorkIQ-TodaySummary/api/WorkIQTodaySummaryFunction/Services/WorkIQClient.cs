using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using WorkIQTodaySummaryFunction.Models;
using WorkIQTodaySummaryFunction.Options;

namespace WorkIQTodaySummaryFunction.Services;

/// <summary>
/// Talks to the Work IQ REST Chat API (https://workiq.svc.cloud.microsoft/rest). Uses the
/// synchronous chat endpoint, not streaming or MCP — see the README for why the REST Chat
/// API is the right surface for a single "what's relevant today" prompt.
/// </summary>
public sealed class WorkIQClient : IWorkIQClient
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public WorkIQClient(HttpClient httpClient, IOptions<WorkIQOptions> options)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress ??= new Uri(options.Value.GatewayBaseUrl.TrimEnd('/') + "/");
    }

    public async Task<TodaySummaryResponse> GetTodaySummaryAsync(
        string workIQAccessToken,
        string timeZone,
        bool includeTeamsMessages,
        CancellationToken cancellationToken)
    {
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", workIQAccessToken);

        // 1. Create a conversation. Each refresh starts a fresh single-turn conversation —
        // this proxy has no need for Work IQ's multi-turn contextId, which keeps it stateless.
        using HttpResponseMessage createResponse = await _httpClient.PostAsJsonAsync(
            "conversations", new { }, SerializerOptions, cancellationToken);
        createResponse.EnsureSuccessStatusCode();

        CopilotConversation conversation = await createResponse.Content
            .ReadFromJsonAsync<CopilotConversation>(SerializerOptions, cancellationToken)
            ?? throw new InvalidOperationException("Work IQ did not return a conversation.");

        // 2. Ask for today's summary. The REST API's contextualResources only covers specific
        // OneDrive/SharePoint files and web search — there's no per-source (email/Teams/etc.)
        // include/exclude toggle. So "include Teams messages" is implemented by steering the
        // prompt wording, not by a request parameter.
        var chatRequest = new ChatRequest
        {
            Message = new ChatRequestMessage { Text = BuildPrompt(includeTeamsMessages) },
            LocationHint = new LocationHint { TimeZone = string.IsNullOrEmpty(timeZone) ? "UTC" : timeZone }
        };

        using HttpResponseMessage chatResponse = await _httpClient.PostAsJsonAsync(
            $"conversations/{conversation.Id}/chat", chatRequest, SerializerOptions, cancellationToken);
        chatResponse.EnsureSuccessStatusCode();

        CopilotConversation result = await chatResponse.Content
            .ReadFromJsonAsync<CopilotConversation>(SerializerOptions, cancellationToken)
            ?? throw new InvalidOperationException("Work IQ did not return a chat response.");

        CopilotConversationMessage? agentMessage = result.Messages
            .LastOrDefault(m => string.Equals(m.ODataType, "#microsoft.graph.copilotConversationResponseMessage", StringComparison.Ordinal))
            ?? result.Messages.LastOrDefault();

        string headline = agentMessage?.Text ?? "Work IQ didn't return a summary this time.";
        IReadOnlyList<ReferencedItem> items = MapReferencedItems(agentMessage?.Attributions ?? new List<CopilotAttribution>());

        return new TodaySummaryResponse(headline, DateTimeOffset.UtcNow, items, FromCache: false);
    }

    private static string BuildPrompt(bool includeTeamsMessages)
    {
        string scope = includeTeamsMessages
            ? "my recent files, today's meetings, and any Teams messages that need my attention"
            : "my recent files and today's meetings (skip Teams chat messages)";

        return "In two or three sentences, summarize what's relevant to me today across " + scope +
               ". Write it as a short, friendly heads-up, not a formal report.";
    }

    private static IReadOnlyList<ReferencedItem> MapReferencedItems(IReadOnlyList<CopilotAttribution> attributions)
    {
        return attributions
            .Where(a => string.Equals(a.AttributionType, "citation", StringComparison.OrdinalIgnoreCase))
            .Select((a, index) => new ReferencedItem(
                Id: index.ToString(CultureInfo.InvariantCulture),
                Type: InferType(a.SeeMoreWebUrl),
                Title: a.ProviderDisplayName is { Length: > 0 } name ? name : "Referenced item",
                Subtitle: null,
                WebUrl: a.SeeMoreWebUrl))
            .ToList();
    }

    private static string InferType(string? webUrl)
    {
        if (string.IsNullOrEmpty(webUrl))
        {
            return "other";
        }

        if (webUrl.Contains("/meeting/details", StringComparison.OrdinalIgnoreCase))
        {
            return "meeting";
        }

        if (webUrl.Contains("teams.microsoft.com/l/message", StringComparison.OrdinalIgnoreCase))
        {
            return "message";
        }

        if (webUrl.Contains(".sharepoint.com", StringComparison.OrdinalIgnoreCase))
        {
            return "file";
        }

        return "other";
    }
}

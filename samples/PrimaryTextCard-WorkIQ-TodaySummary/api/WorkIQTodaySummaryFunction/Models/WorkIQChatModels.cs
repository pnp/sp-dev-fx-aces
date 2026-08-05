using System.Text.Json.Serialization;

namespace WorkIQTodaySummaryFunction.Models;

// DTOs mirroring the Work IQ REST API wire format documented at
// https://learn.microsoft.com/microsoft-365/copilot/extensibility/work-iq/rest/overview
// Only the fields this proxy actually reads/writes are modeled.

internal sealed class CopilotConversation
{
    public string Id { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? State { get; set; }
    public string? Status { get; set; }
    public int TurnCount { get; set; }
    public List<CopilotConversationMessage> Messages { get; set; } = new();
}

internal sealed class CopilotConversationMessage
{
    [JsonPropertyName("@odata.type")]
    public string? ODataType { get; set; }

    public string Id { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTimeOffset CreatedDateTime { get; set; }
    public List<CopilotAttribution> Attributions { get; set; } = new();
}

internal sealed class CopilotAttribution
{
    public string? AttributionType { get; set; }
    public string? ProviderDisplayName { get; set; }
    public string? AttributionSource { get; set; }
    public string? SeeMoreWebUrl { get; set; }
}

internal sealed class ChatRequest
{
    public ChatRequestMessage Message { get; set; } = new();
    public LocationHint LocationHint { get; set; } = new();
}

internal sealed class ChatRequestMessage
{
    public string Text { get; set; } = string.Empty;
}

internal sealed class LocationHint
{
    public string TimeZone { get; set; } = "UTC";
}

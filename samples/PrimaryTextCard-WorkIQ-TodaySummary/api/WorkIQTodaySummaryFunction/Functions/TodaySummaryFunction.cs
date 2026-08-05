using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using WorkIQTodaySummaryFunction.Http;
using WorkIQTodaySummaryFunction.Middleware;
using WorkIQTodaySummaryFunction.Models;
using WorkIQTodaySummaryFunction.Options;
using WorkIQTodaySummaryFunction.Services;

namespace WorkIQTodaySummaryFunction.Functions;

/// <summary>
/// GET /api/todaySummary?includeTeamsMessages=&amp;forceRefresh=&amp;timeZone=
///
/// AadTokenValidationMiddleware runs first and rejects unauthenticated callers, so by the
/// time this handler runs, FunctionContext.Items carries the validated caller's bearer
/// token, tenant ID, and object ID.
/// </summary>
public sealed class TodaySummaryFunction
{
    private readonly IOboTokenService _oboTokenService;
    private readonly IWorkIQClient _workIQClient;
    private readonly IResponseCache _cache;
    private readonly WorkIQOptions _options;
    private readonly ILogger<TodaySummaryFunction> _logger;

    public TodaySummaryFunction(
        IOboTokenService oboTokenService,
        IWorkIQClient workIQClient,
        IResponseCache cache,
        IOptions<WorkIQOptions> options,
        ILogger<TodaySummaryFunction> logger)
    {
        _oboTokenService = oboTokenService;
        _workIQClient = workIQClient;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    [Function("TodaySummary")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "todaySummary")] HttpRequestData request,
        FunctionContext context,
        CancellationToken cancellationToken)
    {
        if (!TryGetCallerContext(context, out string userAssertion, out string tenantId, out string userObjectId))
        {
            return await CreateErrorResponseAsync(request, HttpStatusCode.Unauthorized, "Missing caller identity.");
        }

        bool includeTeamsMessages = ParseBoolQuery(request, "includeTeamsMessages");
        bool forceRefresh = ParseBoolQuery(request, "forceRefresh");
        string timeZone = GetQueryValue(request, "timeZone") ?? "UTC";

        string cacheKey = $"{tenantId}:{userObjectId}:{includeTeamsMessages}";
        TimeSpan minCacheFloor = TimeSpan.FromMinutes(Math.Max(_options.MinCacheTtlMinutes, 0));

        // A cached entry younger than the floor always wins, even over forceRefresh — this
        // is the actual protection against a user mashing "refresh" burning Copilot Credits.
        if (_cache.TryGet(cacheKey, out TodaySummaryResponse? cached) && cached is not null)
        {
            bool withinFloor = DateTimeOffset.UtcNow - cached.GeneratedAt < minCacheFloor;
            if (!forceRefresh || withinFloor)
            {
                return await CreateJsonResponseAsync(request, HttpStatusCode.OK, cached with { FromCache = true });
            }
        }

        try
        {
            string workIQToken = await _oboTokenService.GetWorkIQAccessTokenAsync(userAssertion, tenantId, cancellationToken);
            TodaySummaryResponse summary = await _workIQClient.GetTodaySummaryAsync(workIQToken, timeZone, includeTeamsMessages, cancellationToken);

            _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(Math.Max(_options.CacheTtlMinutes, 1)));

            return await CreateJsonResponseAsync(request, HttpStatusCode.OK, summary);
        }
        catch (MsalUiRequiredException ex)
        {
            _logger.LogWarning(ex, "OBO exchange requires interactive consent for tenant {TenantId}.", tenantId);
            return await CreateErrorResponseAsync(request, HttpStatusCode.Forbidden,
                "Work IQ isn't consented for this app in your tenant yet. Ask an admin to grant admin consent for WorkIQAgent.Ask.");
        }
        catch (MsalServiceException ex)
        {
            _logger.LogWarning(ex, "OBO exchange failed for tenant {TenantId}.", tenantId);
            return await CreateErrorResponseAsync(request, HttpStatusCode.Forbidden,
                "Work IQ isn't available for your account yet. Confirm Work IQ is enabled and licensed for this user.");
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Work IQ REST call failed.");
            return await CreateErrorResponseAsync(request, HttpStatusCode.BadGateway,
                "Work IQ didn't respond. It may be processing a long-running request — try again shortly.");
        }
    }

    private static bool TryGetCallerContext(FunctionContext context, out string userAssertion, out string tenantId, out string userObjectId)
    {
        userAssertion = string.Empty;
        tenantId = string.Empty;
        userObjectId = string.Empty;

        if (context.Items.TryGetValue(CallerContextKeys.UserAssertion, out object? assertionValue) && assertionValue is string assertion)
        {
            userAssertion = assertion;
        }

        if (context.Items.TryGetValue(CallerContextKeys.TenantId, out object? tenantValue) && tenantValue is string tenant)
        {
            tenantId = tenant;
        }

        if (context.Items.TryGetValue(CallerContextKeys.UserObjectId, out object? userValue) && userValue is string user)
        {
            userObjectId = user;
        }

        return userAssertion.Length > 0 && tenantId.Length > 0 && userObjectId.Length > 0;
    }

    private static bool ParseBoolQuery(HttpRequestData request, string name) =>
        bool.TryParse(GetQueryValue(request, name), out bool value) && value;

    private static string? GetQueryValue(HttpRequestData request, string name)
    {
        System.Collections.Specialized.NameValueCollection query =
            System.Web.HttpUtility.ParseQueryString(request.Url.Query);
        return query[name];
    }

    private static Task<HttpResponseData> CreateJsonResponseAsync<T>(HttpRequestData request, HttpStatusCode statusCode, T body) =>
        JsonResponseWriter.WriteAsync(request, statusCode, body);

    private static Task<HttpResponseData> CreateErrorResponseAsync(HttpRequestData request, HttpStatusCode statusCode, string detail) =>
        JsonResponseWriter.WriteAsync(request, statusCode, new { detail });
}

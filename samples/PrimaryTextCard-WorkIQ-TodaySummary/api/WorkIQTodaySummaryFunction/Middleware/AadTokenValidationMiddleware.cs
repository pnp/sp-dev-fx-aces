using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using WorkIQTodaySummaryFunction.Http;
using WorkIQTodaySummaryFunction.Options;
using HttpRequestData = Microsoft.Azure.Functions.Worker.Http.HttpRequestData;

namespace WorkIQTodaySummaryFunction.Middleware;

/// <summary>
/// Validates the bearer token the SPFx ACE sends (acquired via AadHttpClientFactory against
/// this Function's own Application ID URI) before any Function body runs, and stashes the
/// caller's raw token + tid + oid claims for the OBO exchange downstream.
///
/// The token-validation shape here (fetch OIDC metadata, validate signature/expiry/audience)
/// is standard Microsoft Entra guidance for securing a Web API. The one non-standard piece
/// is <see cref="IssuerValidator"/>: because this Function accepts callers from *any* tenant
/// that has consented to the app (it's registered multitenant to satisfy Work IQ's own
/// multitenant issuer rule — see the README), we validate that the issuer is a genuine
/// Microsoft Entra issuer rather than pinning to one tenant's issuer string.
///
/// Unless the app registration's manifest sets <c>accessTokenAcceptedVersion: 2</c>, Entra
/// issues v1.0-format tokens by default (issuer <c>https://sts.windows.net/{tenantId}/</c>),
/// not the v2.0 format (<c>https://login.microsoftonline.com/{tenantId}/v2.0</c>) — and
/// SharePoint's AadHttpClientFactory doesn't give you control over that. So this accepts
/// either issuer shape rather than assuming callers configured their manifest a specific way.
/// </summary>
public sealed class AadTokenValidationMiddleware : IFunctionsWorkerMiddleware
{
    private static readonly Regex AadIssuerPattern = new(
        @"^https://(login\.microsoftonline\.com/[0-9a-fA-F-]{36}/v2\.0|sts\.windows\.net/[0-9a-fA-F-]{36}/)$",
        RegexOptions.Compiled);

    private readonly WorkIQOptions _options;
    private readonly ILogger<AadTokenValidationMiddleware> _logger;
    private readonly ConfigurationManager<OpenIdConnectConfiguration> _configManager;

    public AadTokenValidationMiddleware(IOptions<WorkIQOptions> options, ILogger<AadTokenValidationMiddleware> logger)
    {
        _options = options.Value;
        _logger = logger;
        _configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
            "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever());
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        HttpRequestData? request = await context.GetHttpRequestDataAsync();
        if (request is null)
        {
            // Not an HTTP-triggered invocation — nothing to authenticate.
            await next(context);
            return;
        }

        if (!TryGetBearerToken(request, out string rawToken))
        {
            await ShortCircuitAsync(context, request, HttpStatusCode.Unauthorized, "Missing bearer token.");
            return;
        }

        OpenIdConnectConfiguration config = await _configManager.GetConfigurationAsync(context.CancellationToken);

        var validationParameters = new TokenValidationParameters
        {
            ValidAudiences = new[] { _options.ProxyAudience, _options.ClientId },
            IssuerSigningKeys = config.SigningKeys,
            IssuerValidator = (issuer, _, _) => AadIssuerPattern.IsMatch(issuer)
                ? issuer
                : throw new SecurityTokenInvalidIssuerException($"'{issuer}' is not a recognized Microsoft Entra v2 issuer.")
        };

        // MapInboundClaims defaults to true, which silently renames short JWT claims to legacy
        // long-form URIs (e.g. "oid" -> "http://schemas.microsoft.com/identity/claims/objectidentifier").
        // Turn it off so tid/oid below match the claim names actually present in the token.
        var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
        System.Security.Claims.ClaimsPrincipal principal;
        try
        {
            principal = handler.ValidateToken(rawToken, validationParameters, out _);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Bearer token validation failed.");
            await ShortCircuitAsync(context, request, HttpStatusCode.Unauthorized, "Invalid bearer token.");
            return;
        }

        string? tenantId = principal.FindFirst("tid")?.Value;
        string? userObjectId = principal.FindFirst("oid")?.Value;

        if (string.IsNullOrEmpty(tenantId) || string.IsNullOrEmpty(userObjectId))
        {
            await ShortCircuitAsync(context, request, HttpStatusCode.Unauthorized, "Token is missing required claims.");
            return;
        }

        context.Items[CallerContextKeys.UserAssertion] = rawToken;
        context.Items[CallerContextKeys.TenantId] = tenantId;
        context.Items[CallerContextKeys.UserObjectId] = userObjectId;

        await next(context);
    }

    private static bool TryGetBearerToken(HttpRequestData request, out string token)
    {
        token = string.Empty;

        if (!request.Headers.TryGetValues("Authorization", out IEnumerable<string>? values))
        {
            return false;
        }

        string? header = values.FirstOrDefault();
        const string prefix = "Bearer ";
        if (header is null || !header.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        token = header.Substring(prefix.Length).Trim();
        return token.Length > 0;
    }

    private static async Task ShortCircuitAsync(FunctionContext context, HttpRequestData request, HttpStatusCode statusCode, string detail)
    {
        context.GetInvocationResult().Value = await JsonResponseWriter.WriteAsync(request, statusCode, new { detail });
    }
}

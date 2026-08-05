namespace WorkIQTodaySummaryFunction.Options;

/// <summary>
/// Bound from the "WorkIQ" configuration section (app settings / local.settings.json).
/// </summary>
public sealed class WorkIQOptions
{
    /// <summary>Application (client) ID of this Function's own Entra app registration.</summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>Client secret for this Function's app registration. Prefer a Key Vault reference in app settings over a raw secret.</summary>
    public string ClientSecret { get; set; } = string.Empty;

    /// <summary>This Function's own Application ID URI. Must match the audience the SPFx ACE requests via AadHttpClientFactory.</summary>
    public string ProxyAudience { get; set; } = string.Empty;

    /// <summary>Work IQ Gateway REST base URL.</summary>
    public string GatewayBaseUrl { get; set; } = "https://workiq.svc.cloud.microsoft/rest";

    /// <summary>Delegated scope requested on the OBO exchange.</summary>
    public string Scope { get; set; } = "api://workiq.svc.cloud.microsoft/WorkIQAgent.Ask";

    /// <summary>How long a summary is served from cache before Work IQ is called again.</summary>
    public int CacheTtlMinutes { get; set; } = 15;

    /// <summary>
    /// Floor applied even when a caller passes forceRefresh=true repeatedly. This is the
    /// main lever for controlling Copilot Credits spend — see the README's caching note.
    /// </summary>
    public int MinCacheTtlMinutes { get; set; } = 5;
}

namespace WorkIQTodaySummaryFunction.Services;

public interface IOboTokenService
{
    /// <summary>
    /// Exchanges the caller's SPFx-acquired bearer token for a Work IQ-scoped token via the
    /// On-Behalf-Of flow, in the given tenant's authority.
    /// </summary>
    Task<string> GetWorkIQAccessTokenAsync(string userAssertion, string tenantId, CancellationToken cancellationToken);
}

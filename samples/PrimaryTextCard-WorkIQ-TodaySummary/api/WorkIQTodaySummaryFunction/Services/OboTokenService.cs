using System.Collections.Concurrent;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using WorkIQTodaySummaryFunction.Options;

namespace WorkIQTodaySummaryFunction.Services;

/// <summary>
/// Performs the OBO exchange for a Work IQ-scoped token. This class encapsulates the one
/// piece of this proxy that isn't a documented Microsoft pattern: Work IQ requires the
/// access token's issuer (iss) to match the signed-in user's *home* tenant, not /common or
/// /organizations (see "Multitenant gotcha" in the README). MSAL confidential client apps
/// are normally built once per app with a fixed authority, so we instead keep one
/// confidential client per tenant we've seen, each built with that tenant's own authority,
/// and pick the right one per request based on the caller's `tid` claim.
/// </summary>
public sealed class OboTokenService : IOboTokenService
{
    private readonly WorkIQOptions _options;
    private readonly ConcurrentDictionary<string, IConfidentialClientApplication> _clientsByTenant = new();

    public OboTokenService(IOptions<WorkIQOptions> options)
    {
        _options = options.Value;
    }

    public async Task<string> GetWorkIQAccessTokenAsync(string userAssertion, string tenantId, CancellationToken cancellationToken)
    {
        var confidentialClient = _clientsByTenant.GetOrAdd(tenantId, BuildClientForTenant);

        AuthenticationResult result = await confidentialClient
            .AcquireTokenOnBehalfOf(new[] { _options.Scope }, new UserAssertion(userAssertion))
            .ExecuteAsync(cancellationToken);

        return result.AccessToken;
    }

    private IConfidentialClientApplication BuildClientForTenant(string tenantId)
    {
        return ConfidentialClientApplicationBuilder
            .Create(_options.ClientId)
            .WithClientSecret(_options.ClientSecret)
            .WithAuthority(new Uri($"https://login.microsoftonline.com/{tenantId}/"))
            .Build();
    }
}

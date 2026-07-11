using Microsoft.Extensions.Caching.Memory;
using WorkIQTodaySummaryFunction.Models;

namespace WorkIQTodaySummaryFunction.Services;

/// <summary>
/// Per-instance in-memory cache. Good enough for a sample; a production deployment with
/// more than one Function instance would want a shared cache (e.g. Azure Cache for Redis)
/// so every instance agrees on the last Work IQ response for a given user.
/// </summary>
public sealed class InMemoryResponseCache : IResponseCache
{
    private readonly IMemoryCache _cache;

    public InMemoryResponseCache(IMemoryCache cache)
    {
        _cache = cache;
    }

    public bool TryGet(string key, out TodaySummaryResponse? response) => _cache.TryGetValue(key, out response);

    public void Set(string key, TodaySummaryResponse response, TimeSpan ttl) =>
        _cache.Set(key, response, ttl);
}

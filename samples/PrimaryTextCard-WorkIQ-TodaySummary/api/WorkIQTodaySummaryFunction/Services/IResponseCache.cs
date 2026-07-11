using WorkIQTodaySummaryFunction.Models;

namespace WorkIQTodaySummaryFunction.Services;

public interface IResponseCache
{
    bool TryGet(string key, out TodaySummaryResponse? response);
    void Set(string key, TodaySummaryResponse response, TimeSpan ttl);
}

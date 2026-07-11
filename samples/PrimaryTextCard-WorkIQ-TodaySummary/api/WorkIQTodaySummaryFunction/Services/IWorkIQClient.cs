using WorkIQTodaySummaryFunction.Models;

namespace WorkIQTodaySummaryFunction.Services;

public interface IWorkIQClient
{
    Task<TodaySummaryResponse> GetTodaySummaryAsync(
        string workIQAccessToken,
        string timeZone,
        bool includeTeamsMessages,
        CancellationToken cancellationToken);
}

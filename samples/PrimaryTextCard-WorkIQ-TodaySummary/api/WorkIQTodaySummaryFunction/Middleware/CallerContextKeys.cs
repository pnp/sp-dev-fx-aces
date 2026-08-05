namespace WorkIQTodaySummaryFunction.Middleware;

/// <summary>Keys AadTokenValidationMiddleware uses to stash the validated caller identity on FunctionContext.Items.</summary>
public static class CallerContextKeys
{
    public const string UserAssertion = "WorkIQ.UserAssertion";
    public const string TenantId = "WorkIQ.TenantId";
    public const string UserObjectId = "WorkIQ.UserObjectId";
}

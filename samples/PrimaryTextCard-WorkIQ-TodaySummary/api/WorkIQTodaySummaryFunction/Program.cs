using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WorkIQTodaySummaryFunction.Middleware;
using WorkIQTodaySummaryFunction.Options;
using WorkIQTodaySummaryFunction.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.UseMiddleware<AadTokenValidationMiddleware>();
    })
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        services.AddOptions<WorkIQOptions>()
            .Configure<IConfiguration>((options, configuration) => configuration.GetSection("WorkIQ").Bind(options));

        services.AddMemoryCache();
        services.AddHttpClient<IWorkIQClient, WorkIQClient>();
        services.AddSingleton<IOboTokenService, OboTokenService>();
        services.AddSingleton<IResponseCache, InMemoryResponseCache>();
    })
    .Build();

host.Run();

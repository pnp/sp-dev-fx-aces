using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;

namespace WorkIQTodaySummaryFunction.Http;

/// <summary>Small helper so every handler serializes JSON responses the same way (camelCase, UTF-8).</summary>
public static class JsonResponseWriter
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public static async Task<HttpResponseData> WriteAsync<T>(HttpRequestData request, HttpStatusCode statusCode, T body)
    {
        HttpResponseData response = request.CreateResponse();
        response.StatusCode = statusCode;
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await response.WriteStringAsync(JsonSerializer.Serialize(body, SerializerOptions), Encoding.UTF8);
        return response;
    }
}

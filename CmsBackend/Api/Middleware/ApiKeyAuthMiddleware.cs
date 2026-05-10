using CmsProduct.Application.ApiKeys.Commands.ValidateApiKey;
using MediatR;

namespace CmsProduct.Api.Middleware;

public class ApiKeyAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _headerName;

    private static readonly string[] ProtectedPrefixes = ["/api/dashboard", "/api/crm"];

    public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _headerName = config["ApiKeyAuth:HeaderName"] ?? "X-API-Key";
    }

    public async Task InvokeAsync(HttpContext context, ISender sender)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        if (!IsProtectedPath(path))
        {
            await _next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(_headerName, out var keyValue) || string.IsNullOrWhiteSpace(keyValue))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "API key is missing." });
            return;
        }

        var result = await sender.Send(new ValidateApiKeyCommand(keyValue!));
        if (result.IsFailure || !result.Value)
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new { error = "Invalid or inactive API key." });
            return;
        }

        await _next(context);
    }

    private static bool IsProtectedPath(string path)
    {
        foreach (var prefix in ProtectedPrefixes)
        {
            if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }
}

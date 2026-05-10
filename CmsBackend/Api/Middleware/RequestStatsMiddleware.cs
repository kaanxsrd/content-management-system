using CmsProduct.Application.Stats.Commands.LogRequest;
using MediatR;
using System.Diagnostics;

namespace CmsProduct.Api.Middleware;

public class RequestStatsMiddleware
{
    private readonly RequestDelegate _next;

    public RequestStatsMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ISender sender)
    {
        var sw = Stopwatch.StartNew();

        await _next(context);

        sw.Stop();

        await sender.Send(new LogRequestCommand(
            context.Request.Path.Value ?? "/",
            context.Request.Method,
            context.Response.StatusCode,
            sw.ElapsedMilliseconds));
    }
}

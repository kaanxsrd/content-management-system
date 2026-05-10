using CmsProduct.Api.Middleware;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Api.Startup;

public static class ApiApplication
{
    public static async Task RunAsync(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCmsServices(builder.Configuration);
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
                policy.WithOrigins("http://localhost:3000")
                      .AllowAnyHeader()
                      .AllowAnyMethod());
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();
        }

        app.UseCors();
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseMiddleware<RequestStatsMiddleware>();
        app.UseMiddleware<ApiKeyAuthMiddleware>();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
        app.MapControllers();

        await app.RunAsync();
    }
}

using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Repositories;

public class StatsRepository : IStatsRepository
{
    private readonly AppDbContext _context;

    public StatsRepository(AppDbContext context) => _context = context;

    public async Task AddLogAsync(BackendRequestLog log) =>
        await _context.RequestLogs.AddAsync(log);

    public Task<long> GetTotalRequestsAsync() =>
        _context.RequestLogs.LongCountAsync();

    public Task<long> GetSuccessfulRequestsAsync() =>
        _context.RequestLogs.LongCountAsync(l => l.StatusCode < 400);

    public Task<long> GetFailedRequestsAsync() =>
        _context.RequestLogs.LongCountAsync(l => l.StatusCode >= 400);

    public async Task<double> GetAverageResponseTimeAsync()
    {
        if (!await _context.RequestLogs.AnyAsync())
            return 0;
        return await _context.RequestLogs.AverageAsync(l => (double)l.ElapsedMilliseconds);
    }

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

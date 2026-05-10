using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface IStatsRepository
{
    Task AddLogAsync(BackendRequestLog log);
    Task<long> GetTotalRequestsAsync();
    Task<long> GetSuccessfulRequestsAsync();
    Task<long> GetFailedRequestsAsync();
    Task<double> GetAverageResponseTimeAsync();
    Task SaveChangesAsync();
}

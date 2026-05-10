using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Stats;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Stats.Queries.GetStats;

public class GetStatsQueryHandler : IQueryHandler<GetStatsQuery, BackendStatsResponse>
{
    private readonly IStatsRepository _stats;
    private readonly IApiKeyRepository _apiKeys;

    public GetStatsQueryHandler(IStatsRepository stats, IApiKeyRepository apiKeys)
    {
        _stats = stats;
        _apiKeys = apiKeys;
    }

    public async Task<Result<BackendStatsResponse, IDomainError>> Handle(
        GetStatsQuery request,
        CancellationToken cancellationToken)
    {
        var allKeys = await _apiKeys.GetAllAsync();
        var total = await _stats.GetTotalRequestsAsync();
        var successful = await _stats.GetSuccessfulRequestsAsync();
        var failed = await _stats.GetFailedRequestsAsync();
        var avg = await _stats.GetAverageResponseTimeAsync();

        return Result<BackendStatsResponse, IDomainError>.Success(new BackendStatsResponse
        {
            TotalRequests = total,
            SuccessfulRequests = successful,
            FailedRequests = failed,
            AverageResponseTimeMs = Math.Round(avg, 2),
            ActiveApiKeys = allKeys.Count(k => k.IsActive),
            DisabledApiKeys = allKeys.Count(k => !k.IsActive),
            GeneratedAtUtc = DateTime.UtcNow
        });
    }
}

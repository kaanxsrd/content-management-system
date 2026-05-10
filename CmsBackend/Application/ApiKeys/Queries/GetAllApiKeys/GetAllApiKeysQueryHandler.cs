using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.ApiKeys;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.ApiKeys.Queries.GetAllApiKeys;

public class GetAllApiKeysQueryHandler : IQueryHandler<GetAllApiKeysQuery, List<ApiKeyResponse>>
{
    private readonly IApiKeyRepository _repository;

    public GetAllApiKeysQueryHandler(IApiKeyRepository repository) => _repository = repository;

    public async Task<Result<List<ApiKeyResponse>, IDomainError>> Handle(
        GetAllApiKeysQuery request,
        CancellationToken cancellationToken)
    {
        var keys = await _repository.GetAllAsync();
        return Result<List<ApiKeyResponse>, IDomainError>.Success(keys.Select(MapToResponse).ToList());
    }

    private static ApiKeyResponse MapToResponse(ApiKey k) => new()
    {
        Id = k.Id,
        Name = k.Name,
        IsActive = k.IsActive,
        CreatedAtUtc = k.CreatedAtUtc,
        LastUsedAtUtc = k.LastUsedAtUtc,
        TotalRequests = k.TotalRequests
    };
}

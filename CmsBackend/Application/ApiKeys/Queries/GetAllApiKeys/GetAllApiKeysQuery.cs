using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.ApiKeys;

namespace CmsProduct.Application.ApiKeys.Queries.GetAllApiKeys;

public record GetAllApiKeysQuery : IQuery<List<ApiKeyResponse>>;

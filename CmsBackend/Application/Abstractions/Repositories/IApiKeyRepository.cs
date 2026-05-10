using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface IApiKeyRepository
{
    Task<List<ApiKey>> GetAllAsync();
    Task<List<ApiKey>> GetActiveAsync();
    Task<ApiKey?> GetByIdAsync(Guid id);
    Task AddAsync(ApiKey apiKey);
    Task SaveChangesAsync();
}

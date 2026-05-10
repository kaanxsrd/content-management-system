using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> GetAllActiveAsync();
    Task<Product?> GetByIdAsync(Guid id);
    Task<Dictionary<Guid, string>> GetNamesByIdsAsync(IEnumerable<Guid> ids);
    Task AddAsync(Product product);
    Task SaveChangesAsync();
}

using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context) => _context = context;

    public Task<List<Product>> GetAllAsync() =>
        _context.Products.ToListAsync();

    public Task<List<Product>> GetAllActiveAsync() =>
        _context.Products.Where(p => p.IsActive).ToListAsync();

    public Task<Dictionary<Guid, string>> GetNamesByIdsAsync(IEnumerable<Guid> ids) =>
        _context.Products
            .Where(p => ids.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Name);

    public Task<Product?> GetByIdAsync(Guid id) =>
        _context.Products.FindAsync(id).AsTask();

    public async Task AddAsync(Product product) =>
        await _context.Products.AddAsync(product);

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Repositories;

public class ApiKeyRepository : IApiKeyRepository
{
    private readonly AppDbContext _context;

    public ApiKeyRepository(AppDbContext context) => _context = context;

    public Task<List<ApiKey>> GetAllAsync() =>
        _context.ApiKeys.ToListAsync();

    public Task<List<ApiKey>> GetActiveAsync() =>
        _context.ApiKeys.Where(k => k.IsActive).ToListAsync();

    public Task<ApiKey?> GetByIdAsync(Guid id) =>
        _context.ApiKeys.FindAsync(id).AsTask();

    public async Task AddAsync(ApiKey apiKey) =>
        await _context.ApiKeys.AddAsync(apiKey);

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

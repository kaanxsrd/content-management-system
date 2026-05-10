using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;

namespace CmsProduct.Infrastructure.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly AppDbContext _context;

    public AddressRepository(AppDbContext context) => _context = context;

    public Task<Address?> GetByIdAsync(Guid id) =>
        _context.Addresses.FindAsync(id).AsTask();

    public async Task AddAsync(Address address) =>
        await _context.Addresses.AddAsync(address);

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

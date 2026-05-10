using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context) => _context = context;

    public Task<List<Customer>> GetAllAsync() =>
        _context.Customers.Include(c => c.Address).ToListAsync();

    public Task<Customer?> GetByIdAsync(Guid id) =>
        _context.Customers.Include(c => c.Address).FirstOrDefaultAsync(c => c.Id == id);

    public Task<Customer?> GetByEmailAsync(string email) =>
        _context.Customers.FirstOrDefaultAsync(c => c.Email == email);

    public async Task AddAsync(Customer customer) =>
        await _context.Customers.AddAsync(customer);

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context) => _context = context;

    public Task<List<Order>> GetAllAsync() =>
        _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .ToListAsync();

    public Task<Order?> GetByIdAsync(Guid id) =>
        _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

    public Task<List<Order>> GetByCustomerIdAsync(Guid customerId) =>
        _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customerId)
            .ToListAsync();

    public async Task AddAsync(Order order) =>
        await _context.Orders.AddAsync(order);

    public Task SaveChangesAsync() =>
        _context.SaveChangesAsync();
}

using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(Guid id);
    Task<List<Order>> GetByCustomerIdAsync(Guid customerId);
    Task AddAsync(Order order);
    Task SaveChangesAsync();
}

public record OrderWithDetails(
    Order Order,
    string CustomerName,
    string CustomerEmail,
    string ShippingAddress,
    IReadOnlyDictionary<Guid, string> ProductNames
);

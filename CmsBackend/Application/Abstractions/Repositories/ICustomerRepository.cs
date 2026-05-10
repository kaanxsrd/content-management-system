using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface ICustomerRepository
{
    Task<List<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(Guid id);
    Task<Customer?> GetByEmailAsync(string email);
    Task AddAsync(Customer customer);
    Task SaveChangesAsync();
}

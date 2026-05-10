using CmsProduct.Domain;

namespace CmsProduct.Application.Abstractions.Repositories;

public interface IAddressRepository
{
    Task<Address?> GetByIdAsync(Guid id);
    Task AddAsync(Address address);
    Task SaveChangesAsync();
}

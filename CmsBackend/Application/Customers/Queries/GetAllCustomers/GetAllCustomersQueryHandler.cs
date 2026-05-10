using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Customers;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Customers.Queries.GetAllCustomers;

public class GetAllCustomersQueryHandler : IQueryHandler<GetAllCustomersQuery, List<CustomerResponse>>
{
    private readonly ICustomerRepository _customers;

    public GetAllCustomersQueryHandler(ICustomerRepository customers) => _customers = customers;

    public async Task<Result<List<CustomerResponse>, IDomainError>> Handle(
        GetAllCustomersQuery request,
        CancellationToken cancellationToken)
    {
        var list = await _customers.GetAllAsync();
        return Result<List<CustomerResponse>, IDomainError>.Success(list.Select(MapToResponse).ToList());
    }

    private static CustomerResponse MapToResponse(Customer c) => new()
    {
        Id = c.Id,
        FirstName = c.FirstName,
        LastName = c.LastName,
        FullName = c.FullName,
        Email = c.Email,
        Address = c.Address is null ? null! : new AddressDto
        {
            Id = c.Address.Id,
            Street = c.Address.Street,
            City = c.Address.City,
            ZipCode = c.Address.ZipCode,
            Country = c.Address.Country
        }
    };
}

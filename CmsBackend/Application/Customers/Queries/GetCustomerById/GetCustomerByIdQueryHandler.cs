using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Customers;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Customers.Queries.GetCustomerById;

public class GetCustomerByIdQueryHandler : IQueryHandler<GetCustomerByIdQuery, CustomerResponse>
{
    private readonly ICustomerRepository _customers;

    public GetCustomerByIdQueryHandler(ICustomerRepository customers) => _customers = customers;

    public async Task<Result<CustomerResponse, IDomainError>> Handle(
        GetCustomerByIdQuery request,
        CancellationToken cancellationToken)
    {
        var customer = await _customers.GetByIdAsync(request.Id);
        if (customer is null)
            return DomainError.NotFound($"Customer {request.Id} not found.");

        return Result<CustomerResponse, IDomainError>.Success(MapToResponse(customer));
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

using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Customers;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Customers.Queries.GetCustomerByEmail;

public class GetCustomerByEmailQueryHandler : IQueryHandler<GetCustomerByEmailQuery, CustomerResponse>
{
    private readonly ICustomerRepository _customers;

    public GetCustomerByEmailQueryHandler(ICustomerRepository customers) => _customers = customers;

    public async Task<Result<CustomerResponse, IDomainError>> Handle(
        GetCustomerByEmailQuery request,
        CancellationToken cancellationToken)
    {
        var customer = await _customers.GetByEmailAsync(request.Email);
        if (customer is null)
            return DomainError.NotFound($"No customer with email '{request.Email}'.");

        return Result<CustomerResponse, IDomainError>.Success(new CustomerResponse
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            FullName = customer.FullName,
            Email = customer.Email,
            Address = customer.Address is null ? null! : new AddressDto
            {
                Id = customer.Address.Id,
                Street = customer.Address.Street,
                City = customer.Address.City,
                ZipCode = customer.Address.ZipCode,
                Country = customer.Address.Country
            }
        });
    }
}

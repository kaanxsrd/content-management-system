using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Customers;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Customers.Commands.CreateCustomer;

public class CreateCustomerCommandHandler : ICommandHandler<CreateCustomerCommand, CustomerResponse>
{
    private readonly ICustomerRepository _customers;
    private readonly IAddressRepository _addresses;

    public CreateCustomerCommandHandler(ICustomerRepository customers, IAddressRepository addresses)
    {
        _customers = customers;
        _addresses = addresses;
    }

    public async Task<Result<CustomerResponse, IDomainError>> Handle(
        CreateCustomerCommand request,
        CancellationToken cancellationToken)
    {
        var existing = await _customers.GetByEmailAsync(request.Email);
        if (existing is not null)
            return DomainError.Conflict($"A customer with email '{request.Email}' already exists.");

        var address = Address.Create(request.Street, request.City, request.ZipCode, request.Country);
        await _addresses.AddAsync(address);
        await _addresses.SaveChangesAsync();

        var customer = Customer.Create(request.FirstName, request.LastName, request.Email, address.Id);
        await _customers.AddAsync(customer);
        await _customers.SaveChangesAsync();

        customer = (await _customers.GetByIdAsync(customer.Id))!;

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

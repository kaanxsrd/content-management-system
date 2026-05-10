using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Customers;

namespace CmsProduct.Application.Customers.Commands.CreateCustomer;

public record CreateCustomerCommand(
    string FirstName,
    string LastName,
    string Email,
    string Street,
    string City,
    string ZipCode,
    string Country
) : ICommand<CustomerResponse>;

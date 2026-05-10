using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Customers;

namespace CmsProduct.Application.Customers.Queries.GetCustomerByEmail;

public record GetCustomerByEmailQuery(string Email) : IQuery<CustomerResponse>;

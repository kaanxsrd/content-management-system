using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Customers;

namespace CmsProduct.Application.Customers.Queries.GetCustomerById;

public record GetCustomerByIdQuery(Guid Id) : IQuery<CustomerResponse>;

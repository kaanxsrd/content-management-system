using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Customers;

namespace CmsProduct.Application.Customers.Queries.GetAllCustomers;

public record GetAllCustomersQuery : IQuery<List<CustomerResponse>>;

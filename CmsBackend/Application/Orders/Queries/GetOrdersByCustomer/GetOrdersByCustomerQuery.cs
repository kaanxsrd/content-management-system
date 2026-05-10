using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Orders;

namespace CmsProduct.Application.Orders.Queries.GetOrdersByCustomer;

public record GetOrdersByCustomerQuery(Guid CustomerId) : IQuery<List<OrderResponse>>;

using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Orders;

namespace CmsProduct.Application.Orders.Queries.GetOrdersByEmail;

public record GetOrdersByEmailQuery(string Email) : IQuery<List<OrderResponse>>;

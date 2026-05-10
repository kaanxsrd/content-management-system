using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Orders;

namespace CmsProduct.Application.Orders.Queries.GetAllOrders;

public record GetAllOrdersQuery : IQuery<List<OrderResponse>>;

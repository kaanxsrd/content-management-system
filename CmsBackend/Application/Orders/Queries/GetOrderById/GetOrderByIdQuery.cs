using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Orders;

namespace CmsProduct.Application.Orders.Queries.GetOrderById;

public record GetOrderByIdQuery(Guid Id) : IQuery<OrderResponse>;

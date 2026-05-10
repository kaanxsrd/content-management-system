using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Orders;

namespace CmsProduct.Application.Orders.Commands.CreateOrder;

public record CreateOrderCommand(
    Guid CustomerId,
    Guid ShippingAddressId,
    List<OrderLineRequest> Items
) : ICommand<OrderResponse>;

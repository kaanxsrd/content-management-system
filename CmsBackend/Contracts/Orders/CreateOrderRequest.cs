namespace CmsProduct.Contracts.Orders;

public class CreateOrderRequest
{
    public Guid CustomerId { get; init; }
    public Guid ShippingAddressId { get; init; }
    public List<OrderLineRequest> Items { get; init; } = [];
}

public class OrderLineRequest
{
    public Guid ProductId { get; init; }
    public int Quantity { get; init; }
}

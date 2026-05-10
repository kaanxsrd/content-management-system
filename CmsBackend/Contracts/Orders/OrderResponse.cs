namespace CmsProduct.Contracts.Orders;

public class OrderResponse
{
    public Guid Id { get; init; }
    public Guid CustomerId { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string CustomerEmail { get; init; } = string.Empty;
    public Guid ShippingAddressId { get; init; }
    public string ShippingAddress { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public decimal TotalAmount { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public List<OrderItemDto> Items { get; init; } = [];
}

public class OrderItemDto
{
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal TotalPrice { get; init; }
}

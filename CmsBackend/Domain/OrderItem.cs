using CmsProduct.Domain.Common;

namespace CmsProduct.Domain;

public class OrderItem : Entity
{
    public Guid OrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    private OrderItem() { }

    public static OrderItem Create(Guid orderId, Guid productId, int quantity, decimal unitPrice) => new()
    {
        OrderId = orderId,
        ProductId = productId,
        Quantity = quantity,
        UnitPrice = unitPrice
    };

    public decimal TotalPrice => UnitPrice * Quantity;
}

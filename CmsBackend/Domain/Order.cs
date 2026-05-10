using CmsProduct.Domain.Common;
using CmsProduct.Domain.Events;

namespace CmsProduct.Domain;

public class Order : AggregateRoot
{
    public Guid CustomerId { get; private set; }
    public Customer Customer { get; private set; } = null!;
    public Guid ShippingAddressId { get; private set; }
    public Address ShippingAddress { get; private set; } = null!;
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    public DateTime CreatedAtUtc { get; private set; } = DateTime.UtcNow;
    public List<OrderItem> Items { get; private set; } = [];

    private Order() { }

    public static Order Create(Guid customerId, Guid shippingAddressId)
    {
        var order = new Order
        {
            CustomerId = customerId,
            ShippingAddressId = shippingAddressId
        };
        order.RaiseDomainEvent(new OrderCreatedDomainEvent(order.Id, customerId));
        return order;
    }

    public void AddItem(Guid productId, int quantity, decimal unitPrice) =>
        Items.Add(OrderItem.Create(Id, productId, quantity, unitPrice));

    public void Confirm() => Status = OrderStatus.Confirmed;
    public void Ship() => Status = OrderStatus.Shipped;
    public void Deliver() => Status = OrderStatus.Delivered;
    public void Cancel() => Status = OrderStatus.Cancelled;

    public decimal TotalAmount => Items.Sum(i => i.TotalPrice);
}

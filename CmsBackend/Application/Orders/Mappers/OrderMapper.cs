using CmsProduct.Contracts.Orders;
using CmsProduct.Domain;

namespace CmsProduct.Application.Orders.Mappers;

public static class OrderMapper
{
    public static OrderResponse ToResponse(Order o, IReadOnlyDictionary<Guid, string>? productNames = null)
    {
        var shippingAddr = o.ShippingAddress is null ? string.Empty
            : $"{o.ShippingAddress.Street}, {o.ShippingAddress.City} {o.ShippingAddress.ZipCode}, {o.ShippingAddress.Country}";

        return new OrderResponse
        {
            Id = o.Id,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer?.FullName ?? string.Empty,
            CustomerEmail = o.Customer?.Email ?? string.Empty,
            ShippingAddressId = o.ShippingAddressId,
            ShippingAddress = shippingAddr,
            Status = o.Status.ToString(),
            TotalAmount = o.TotalAmount,
            CreatedAtUtc = o.CreatedAtUtc,
            Items = o.Items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = productNames is not null && productNames.TryGetValue(i.ProductId, out var name) ? name : string.Empty,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}

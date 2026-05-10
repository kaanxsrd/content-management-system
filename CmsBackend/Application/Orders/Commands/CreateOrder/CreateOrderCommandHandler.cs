using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.Orders.Mappers;
using CmsProduct.Contracts.Orders;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand, OrderResponse>
{
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;

    public CreateOrderCommandHandler(IOrderRepository orders, IProductRepository products)
    {
        _orders = orders;
        _products = products;
    }

    public async Task<Result<OrderResponse, IDomainError>> Handle(
        CreateOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order = Order.Create(request.CustomerId, request.ShippingAddressId);
        var productIds = request.Items.Select(l => l.ProductId).Distinct().ToList();
        var products = await _products.GetNamesByIdsAsync(productIds);

        foreach (var line in request.Items)
        {
            var product = await _products.GetByIdAsync(line.ProductId);
            if (product is null)
                return DomainError.NotFound($"Product {line.ProductId} not found.");

            order.AddItem(product.Id, line.Quantity, product.Price);
        }

        await _orders.AddAsync(order);
        await _orders.SaveChangesAsync();

        return Result<OrderResponse, IDomainError>.Success(OrderMapper.ToResponse(order, products));
    }
}

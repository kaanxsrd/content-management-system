using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.Orders.Mappers;
using CmsProduct.Contracts.Orders;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Orders.Queries.GetOrderById;

public class GetOrderByIdQueryHandler : IQueryHandler<GetOrderByIdQuery, OrderResponse>
{
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;

    public GetOrderByIdQueryHandler(IOrderRepository orders, IProductRepository products)
    {
        _orders = orders;
        _products = products;
    }

    public async Task<Result<OrderResponse, IDomainError>> Handle(
        GetOrderByIdQuery request,
        CancellationToken cancellationToken)
    {
        var order = await _orders.GetByIdAsync(request.Id);
        if (order is null)
            return DomainError.NotFound($"Order {request.Id} not found.");

        var productIds = order.Items.Select(i => i.ProductId);
        var productNames = await _products.GetNamesByIdsAsync(productIds);

        return Result<OrderResponse, IDomainError>.Success(OrderMapper.ToResponse(order, productNames));
    }
}

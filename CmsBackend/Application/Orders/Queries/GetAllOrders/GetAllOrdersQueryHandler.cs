using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.Orders.Mappers;
using CmsProduct.Contracts.Orders;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Orders.Queries.GetAllOrders;

public class GetAllOrdersQueryHandler : IQueryHandler<GetAllOrdersQuery, List<OrderResponse>>
{
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;

    public GetAllOrdersQueryHandler(IOrderRepository orders, IProductRepository products)
    {
        _orders = orders;
        _products = products;
    }

    public async Task<Result<List<OrderResponse>, IDomainError>> Handle(
        GetAllOrdersQuery request,
        CancellationToken cancellationToken)
    {
        var list = await _orders.GetAllAsync();
        var productIds = list.SelectMany(o => o.Items.Select(i => i.ProductId)).Distinct();
        var productNames = await _products.GetNamesByIdsAsync(productIds);

        return Result<List<OrderResponse>, IDomainError>.Success(
            list.Select(o => OrderMapper.ToResponse(o, productNames)).ToList());
    }
}

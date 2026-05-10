using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.Orders.Mappers;
using CmsProduct.Contracts.Orders;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Orders.Queries.GetOrdersByCustomer;

public class GetOrdersByCustomerQueryHandler : IQueryHandler<GetOrdersByCustomerQuery, List<OrderResponse>>
{
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;

    public GetOrdersByCustomerQueryHandler(IOrderRepository orders, IProductRepository products)
    {
        _orders = orders;
        _products = products;
    }

    public async Task<Result<List<OrderResponse>, IDomainError>> Handle(
        GetOrdersByCustomerQuery request,
        CancellationToken cancellationToken)
    {
        var list = await _orders.GetByCustomerIdAsync(request.CustomerId);
        var productIds = list.SelectMany(o => o.Items.Select(i => i.ProductId)).Distinct();
        var productNames = await _products.GetNamesByIdsAsync(productIds);

        return Result<List<OrderResponse>, IDomainError>.Success(
            list.Select(o => OrderMapper.ToResponse(o, productNames)).ToList());
    }
}

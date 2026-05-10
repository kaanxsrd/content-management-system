using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Application.Orders.Mappers;
using CmsProduct.Contracts.Orders;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Orders.Queries.GetOrdersByEmail;

public class GetOrdersByEmailQueryHandler : IQueryHandler<GetOrdersByEmailQuery, List<OrderResponse>>
{
    private readonly ICustomerRepository _customers;
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;

    public GetOrdersByEmailQueryHandler(
        ICustomerRepository customers,
        IOrderRepository orders,
        IProductRepository products)
    {
        _customers = customers;
        _orders = orders;
        _products = products;
    }

    public async Task<Result<List<OrderResponse>, IDomainError>> Handle(
        GetOrdersByEmailQuery request,
        CancellationToken cancellationToken)
    {
        var customer = await _customers.GetByEmailAsync(request.Email);
        if (customer is null)
            return Result<List<OrderResponse>, IDomainError>.Success([]);

        var list = await _orders.GetByCustomerIdAsync(customer.Id);
        var productIds = list.SelectMany(o => o.Items.Select(i => i.ProductId)).Distinct();
        var productNames = await _products.GetNamesByIdsAsync(productIds);

        return Result<List<OrderResponse>, IDomainError>.Success(
            list.Select(o => OrderMapper.ToResponse(o, productNames)).ToList());
    }
}

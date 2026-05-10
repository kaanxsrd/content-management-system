using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Products;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Products.Queries.GetAllProducts;

public class GetAllProductsQueryHandler : IQueryHandler<GetAllProductsQuery, List<ProductResponse>>
{
    private readonly IProductRepository _products;

    public GetAllProductsQueryHandler(IProductRepository products) => _products = products;

    public async Task<Result<List<ProductResponse>, IDomainError>> Handle(
        GetAllProductsQuery request,
        CancellationToken cancellationToken)
    {
        var list = await _products.GetAllActiveAsync();
        var response = list.Select(p => new ProductResponse
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            IsActive = p.IsActive,
            Stock = p.Stock
        }).ToList();

        return Result<List<ProductResponse>, IDomainError>.Success(response);
    }
}

using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Products;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IQueryHandler<GetProductByIdQuery, ProductResponse>
{
    private readonly IProductRepository _products;

    public GetProductByIdQueryHandler(IProductRepository products) => _products = products;

    public async Task<Result<ProductResponse, IDomainError>> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        var product = await _products.GetByIdAsync(request.Id);
        if (product is null)
            return DomainError.NotFound($"Product {request.Id} not found.");

        return Result<ProductResponse, IDomainError>.Success(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive,
            Stock = product.Stock
        });
    }
}

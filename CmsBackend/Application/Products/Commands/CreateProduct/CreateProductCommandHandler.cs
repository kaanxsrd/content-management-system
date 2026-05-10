using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Products;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, ProductResponse>
{
    private readonly IProductRepository _products;

    public CreateProductCommandHandler(IProductRepository products) => _products = products;

    public async Task<Result<ProductResponse, IDomainError>> Handle(
        CreateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = Product.Create(request.Name, request.Description, request.Price, request.ImageUrl, request.Stock);
        await _products.AddAsync(product);
        await _products.SaveChangesAsync();

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

using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Products;

namespace CmsProduct.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    string? ImageUrl,
    int Stock = 0
) : ICommand<ProductResponse>;

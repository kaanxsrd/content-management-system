using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Products;

namespace CmsProduct.Application.Products.Queries.GetAllProducts;

public record GetAllProductsQuery : IQuery<List<ProductResponse>>;

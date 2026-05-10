using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Products;

namespace CmsProduct.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IQuery<ProductResponse>;

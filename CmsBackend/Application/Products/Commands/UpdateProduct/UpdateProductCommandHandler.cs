using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : ICommandHandler<UpdateProductCommand>
{
    private readonly IProductRepository _products;

    public UpdateProductCommandHandler(IProductRepository products) => _products = products;

    public async Task<Result<Unit, IDomainError>> Handle(
        UpdateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _products.GetByIdAsync(request.Id);
        if (product is null)
            return DomainError.NotFound($"Product {request.Id} not found.");

        product.Rename(request.Name);
        product.UpdatePrice(request.Price);
        product.UpdateImageUrl(request.ImageUrl);
        product.SetStock(request.Stock);
        await _products.SaveChangesAsync();

        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

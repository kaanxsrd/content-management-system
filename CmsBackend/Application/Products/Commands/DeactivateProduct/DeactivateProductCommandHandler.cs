using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Products.Commands.DeactivateProduct;

public class DeactivateProductCommandHandler : ICommandHandler<DeactivateProductCommand>
{
    private readonly IProductRepository _products;

    public DeactivateProductCommandHandler(IProductRepository products) => _products = products;

    public async Task<Result<Unit, IDomainError>> Handle(
        DeactivateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _products.GetByIdAsync(request.Id);
        if (product is null)
            return DomainError.NotFound($"Product {request.Id} not found.");

        product.Deactivate();
        await _products.SaveChangesAsync();

        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

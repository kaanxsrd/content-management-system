using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Products.Commands.UpdateStock;

public class UpdateStockCommandHandler : ICommandHandler<UpdateStockCommand>
{
    private readonly IProductRepository _products;

    public UpdateStockCommandHandler(IProductRepository products) => _products = products;

    public async Task<Result<Unit, IDomainError>> Handle(
        UpdateStockCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _products.GetByIdAsync(request.ProductId);
        if (product is null)
            return DomainError.NotFound($"Product {request.ProductId} not found.");

        product.SetStock(request.Stock);
        await _products.SaveChangesAsync();

        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

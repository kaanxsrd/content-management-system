using CmsProduct.Application.Abstractions;

namespace CmsProduct.Application.Products.Commands.UpdateStock;

public record UpdateStockCommand(Guid ProductId, int Stock) : ICommand;

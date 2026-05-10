using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Products.Commands.UpdateProduct;

public record UpdateProductCommand(Guid Id, string Name, decimal Price, string? ImageUrl, int Stock = 0) : ICommand;

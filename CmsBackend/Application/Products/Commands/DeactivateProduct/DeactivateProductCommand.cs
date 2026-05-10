using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Products.Commands.DeactivateProduct;

public record DeactivateProductCommand(Guid Id) : ICommand;

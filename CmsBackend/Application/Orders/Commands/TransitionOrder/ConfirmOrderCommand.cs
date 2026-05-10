using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Orders.Commands.TransitionOrder;

public record ConfirmOrderCommand(Guid OrderId) : ICommand;

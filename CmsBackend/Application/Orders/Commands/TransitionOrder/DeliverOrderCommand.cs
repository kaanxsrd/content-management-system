using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Orders.Commands.TransitionOrder;

public record DeliverOrderCommand(Guid OrderId) : ICommand;

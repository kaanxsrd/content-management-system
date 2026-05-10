using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Orders.Commands.TransitionOrder;

public class ConfirmOrderCommandHandler : ICommandHandler<ConfirmOrderCommand>
{
    private readonly IOrderRepository _orders;

    public ConfirmOrderCommandHandler(IOrderRepository orders) => _orders = orders;

    public async Task<Result<Unit, IDomainError>> Handle(
        ConfirmOrderCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orders.GetByIdAsync(request.OrderId);
        if (order is null)
            return DomainError.NotFound($"Order {request.OrderId} not found.");

        order.Confirm();
        await _orders.SaveChangesAsync();
        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

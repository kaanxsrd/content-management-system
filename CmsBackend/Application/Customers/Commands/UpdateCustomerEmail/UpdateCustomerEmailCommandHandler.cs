using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Customers.Commands.UpdateCustomerEmail;

public class UpdateCustomerEmailCommandHandler : ICommandHandler<UpdateCustomerEmailCommand>
{
    private readonly ICustomerRepository _customers;

    public UpdateCustomerEmailCommandHandler(ICustomerRepository customers) => _customers = customers;

    public async Task<Result<Unit, IDomainError>> Handle(
        UpdateCustomerEmailCommand request,
        CancellationToken cancellationToken)
    {
        var customer = await _customers.GetByIdAsync(request.CustomerId);
        if (customer is null)
            return DomainError.NotFound($"Customer {request.CustomerId} not found.");

        customer.UpdateEmail(request.Email);
        await _customers.SaveChangesAsync();

        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

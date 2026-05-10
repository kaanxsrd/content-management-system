using FluentValidation;

namespace CmsProduct.Application.Customers.Commands.UpdateCustomerEmail;

public class UpdateCustomerEmailCommandValidator : AbstractValidator<UpdateCustomerEmailCommand>
{
    public UpdateCustomerEmailCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(320);
    }
}

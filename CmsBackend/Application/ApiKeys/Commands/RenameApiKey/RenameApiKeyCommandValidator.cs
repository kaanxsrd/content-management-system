using FluentValidation;

namespace CmsProduct.Application.ApiKeys.Commands.RenameApiKey;

public class RenameApiKeyCommandValidator : AbstractValidator<RenameApiKeyCommand>
{
    public RenameApiKeyCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}

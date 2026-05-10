using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.ApiKeys.Commands.ValidateApiKey;

public class ValidateApiKeyCommandHandler : ICommandHandler<ValidateApiKeyCommand, bool>
{
    private readonly IApiKeyRepository _repository;

    public ValidateApiKeyCommandHandler(IApiKeyRepository repository) => _repository = repository;

    public async Task<Result<bool, IDomainError>> Handle(
        ValidateApiKeyCommand request,
        CancellationToken cancellationToken)
    {
        var activeKeys = await _repository.GetActiveAsync();

        foreach (var key in activeKeys)
        {
            if (key.Verify(request.RawKey))
            {
                key.MarkUsed();
                await _repository.SaveChangesAsync();
                return Result<bool, IDomainError>.Success(true);
            }
        }

        return Result<bool, IDomainError>.Success(false);
    }
}

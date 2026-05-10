using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.ApiKeys.Commands.RenameApiKey;

public class RenameApiKeyCommandHandler : ICommandHandler<RenameApiKeyCommand>
{
    private readonly IApiKeyRepository _repository;

    public RenameApiKeyCommandHandler(IApiKeyRepository repository) => _repository = repository;

    public async Task<Result<Unit, IDomainError>> Handle(
        RenameApiKeyCommand request,
        CancellationToken cancellationToken)
    {
        var key = await _repository.GetByIdAsync(request.Id);
        if (key is null)
            return DomainError.NotFound($"API key {request.Id} not found.");

        key.Rename(request.Name);
        await _repository.SaveChangesAsync();
        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

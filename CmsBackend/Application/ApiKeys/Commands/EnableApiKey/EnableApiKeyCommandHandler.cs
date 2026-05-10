using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.ApiKeys.Commands.EnableApiKey;

public class EnableApiKeyCommandHandler : ICommandHandler<EnableApiKeyCommand>
{
    private readonly IApiKeyRepository _repository;

    public EnableApiKeyCommandHandler(IApiKeyRepository repository) => _repository = repository;

    public async Task<Result<Unit, IDomainError>> Handle(
        EnableApiKeyCommand request,
        CancellationToken cancellationToken)
    {
        var key = await _repository.GetByIdAsync(request.Id);
        if (key is null)
            return DomainError.NotFound($"API key {request.Id} not found.");

        key.Enable();
        await _repository.SaveChangesAsync();
        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

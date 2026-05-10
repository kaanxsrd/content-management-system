using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.ApiKeys;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.ApiKeys.Commands.CreateApiKey;

public class CreateApiKeyCommandHandler : ICommandHandler<CreateApiKeyCommand, CreateApiKeyResponse>
{
    private readonly IApiKeyRepository _repository;
    private readonly IApiKeyGenerator _generator;

    public CreateApiKeyCommandHandler(IApiKeyRepository repository, IApiKeyGenerator generator)
    {
        _repository = repository;
        _generator = generator;
    }

    public async Task<Result<CreateApiKeyResponse, IDomainError>> Handle(
        CreateApiKeyCommand request,
        CancellationToken cancellationToken)
    {
        var rawKey = _generator.Generate();
        var hash = _generator.Hash(rawKey);
        var apiKey = ApiKey.Create(request.Name, hash);

        await _repository.AddAsync(apiKey);
        await _repository.SaveChangesAsync();

        return Result<CreateApiKeyResponse, IDomainError>.Success(new CreateApiKeyResponse
        {
            Id = apiKey.Id,
            Name = apiKey.Name,
            RawKey = rawKey,
            CreatedAtUtc = apiKey.CreatedAtUtc
        });
    }
}

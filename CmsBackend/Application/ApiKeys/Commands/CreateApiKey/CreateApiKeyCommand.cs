using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.ApiKeys;

namespace CmsProduct.Application.ApiKeys.Commands.CreateApiKey;

public record CreateApiKeyCommand(string Name) : ICommand<CreateApiKeyResponse>;

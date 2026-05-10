using CmsProduct.Application.Abstractions;

namespace CmsProduct.Application.ApiKeys.Commands.ValidateApiKey;

public record ValidateApiKeyCommand(string RawKey) : ICommand<bool>;

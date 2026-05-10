using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.ApiKeys.Commands.DisableApiKey;

public record DisableApiKeyCommand(Guid Id) : ICommand;

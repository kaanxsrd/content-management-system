using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.ApiKeys.Commands.EnableApiKey;

public record EnableApiKeyCommand(Guid Id) : ICommand;

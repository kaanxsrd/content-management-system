using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.ApiKeys.Commands.RenameApiKey;

public record RenameApiKeyCommand(Guid Id, string Name) : ICommand;

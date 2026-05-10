using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Stats.Commands.LogRequest;

public record LogRequestCommand(
    string Path,
    string Method,
    int StatusCode,
    long ElapsedMilliseconds
) : ICommand;

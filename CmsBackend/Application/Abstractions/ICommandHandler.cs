using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Abstractions;

public interface ICommandHandler<TRequest, TResponse>
    : IRequestHandler<TRequest, Result<TResponse, IDomainError>>
    where TRequest : ICommand<TResponse>
    where TResponse : notnull { }

public interface ICommandHandler<TRequest>
    : IRequestHandler<TRequest, Result<Unit, IDomainError>>
    where TRequest : ICommand { }

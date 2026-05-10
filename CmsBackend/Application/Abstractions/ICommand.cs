using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Abstractions;

public interface ICommand<TResponse> : IRequest<Result<TResponse, IDomainError>>
    where TResponse : notnull { }

public interface ICommand : IRequest<Result<Unit, IDomainError>> { }

using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Abstractions;

public interface IQueryHandler<TRequest, TResponse>
    : IRequestHandler<TRequest, Result<TResponse, IDomainError>>
    where TRequest : IQuery<TResponse>
    where TResponse : notnull { }

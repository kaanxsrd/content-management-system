using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Abstractions;

public interface IQuery<TResponse> : IRequest<Result<TResponse, IDomainError>>
    where TResponse : notnull { }

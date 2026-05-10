using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using MediatR;

namespace CmsProduct.Application.Stats.Commands.LogRequest;

public class LogRequestCommandHandler : ICommandHandler<LogRequestCommand>
{
    private readonly IStatsRepository _stats;

    public LogRequestCommandHandler(IStatsRepository stats) => _stats = stats;

    public async Task<Result<Unit, IDomainError>> Handle(
        LogRequestCommand request,
        CancellationToken cancellationToken)
    {
        var log = BackendRequestLog.Create(
            request.Path,
            request.Method,
            request.StatusCode,
            request.ElapsedMilliseconds);

        await _stats.AddLogAsync(log);
        await _stats.SaveChangesAsync();

        return Result<Unit, IDomainError>.Success(Unit.Value);
    }
}

using CmsProduct.Api.Extensions;
using CmsProduct.Application.Stats.Queries.GetStats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/admin/stats")]
public class AdminStatsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminStatsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetStats() =>
        (await _sender.Send(new GetStatsQuery())).ToActionResult(this);
}

using CmsProduct.Api.Extensions;
using CmsProduct.Application.ApiKeys.Commands.CreateApiKey;
using CmsProduct.Application.ApiKeys.Commands.DisableApiKey;
using CmsProduct.Application.ApiKeys.Commands.EnableApiKey;
using CmsProduct.Application.ApiKeys.Commands.RenameApiKey;
using CmsProduct.Application.ApiKeys.Queries.GetAllApiKeys;
using CmsProduct.Contracts.ApiKeys;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/admin/api-keys")]
public class AdminApiKeysController : ControllerBase
{
    private readonly ISender _sender;

    public AdminApiKeysController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        (await _sender.Send(new GetAllApiKeysQuery())).ToActionResult(this);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApiKeyRequest request)
    {
        var result = await _sender.Send(new CreateApiKeyCommand(request.Name));
        return result.ToCreatedResult(this, nameof(GetAll), null!);
    }

    [HttpPut("{id:guid}/rename")]
    public async Task<IActionResult> Rename(Guid id, [FromBody] RenameApiKeyRequest request)
    {
        var result = await _sender.Send(new RenameApiKeyCommand(id, request.Name));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPut("{id:guid}/enable")]
    public async Task<IActionResult> Enable(Guid id)
    {
        var result = await _sender.Send(new EnableApiKeyCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPut("{id:guid}/disable")]
    public async Task<IActionResult> Disable(Guid id)
    {
        var result = await _sender.Send(new DisableApiKeyCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }
}

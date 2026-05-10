using CmsProduct.Api.Extensions;
using CmsProduct.Application.Addresses.Commands.CreateAddress;
using CmsProduct.Contracts.Addresses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/crm/addresses")]
public class CrmAddressesController : ControllerBase
{
    private readonly ISender _sender;

    public CrmAddressesController(ISender sender) => _sender = sender;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAddressRequest request)
    {
        var result = await _sender.Send(
            new CreateAddressCommand(request.Street, request.City, request.ZipCode, request.Country));
        return result.ToActionResult(this);
    }
}

using CmsProduct.Api.Extensions;
using CmsProduct.Application.Customers.Commands.CreateCustomer;
using CmsProduct.Application.Customers.Commands.UpdateCustomerEmail;
using CmsProduct.Application.Customers.Queries.GetAllCustomers;
using CmsProduct.Application.Customers.Queries.GetCustomerByEmail;
using CmsProduct.Application.Customers.Queries.GetCustomerById;
using CmsProduct.Contracts.Customers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/crm/customers")]
public class CrmCustomersController : ControllerBase
{
    private readonly ISender _sender;

    public CrmCustomersController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        (await _sender.Send(new GetAllCustomersQuery())).ToActionResult(this);

    [HttpGet("by-email")]
    public async Task<IActionResult> GetByEmail([FromQuery] string email) =>
        (await _sender.Send(new GetCustomerByEmailQuery(email))).ToActionResult(this);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id) =>
        (await _sender.Send(new GetCustomerByIdQuery(id))).ToActionResult(this);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request)
    {
        var command = new CreateCustomerCommand(
            request.FirstName, request.LastName, request.Email,
            request.Street, request.City, request.ZipCode, request.Country);
        var result = await _sender.Send(command);
        return result.ToCreatedResult(this, nameof(GetById), new { id = result.IsSuccess ? result.Value.Id : Guid.Empty });
    }

    [HttpPut("{id:guid}/email")]
    public async Task<IActionResult> UpdateEmail(Guid id, [FromBody] UpdateCustomerEmailRequest request)
    {
        var result = await _sender.Send(new UpdateCustomerEmailCommand(id, request.Email));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }
}

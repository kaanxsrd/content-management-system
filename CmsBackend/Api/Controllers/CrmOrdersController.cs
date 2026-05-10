using CmsProduct.Api.Extensions;
using CmsProduct.Application.Orders.Commands.CreateOrder;
using CmsProduct.Application.Orders.Commands.TransitionOrder;
using CmsProduct.Application.Orders.Queries.GetAllOrders;
using CmsProduct.Application.Orders.Queries.GetOrderById;
using CmsProduct.Application.Orders.Queries.GetOrdersByCustomer;
using CmsProduct.Application.Orders.Queries.GetOrdersByEmail;
using CmsProduct.Contracts.Orders;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/crm/orders")]
public class CrmOrdersController : ControllerBase
{
    private readonly ISender _sender;

    public CrmOrdersController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        (await _sender.Send(new GetAllOrdersQuery())).ToActionResult(this);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id) =>
        (await _sender.Send(new GetOrderByIdQuery(id))).ToActionResult(this);

    [HttpGet("by-customer/{customerId:guid}")]
    public async Task<IActionResult> GetByCustomer(Guid customerId) =>
        (await _sender.Send(new GetOrdersByCustomerQuery(customerId))).ToActionResult(this);

    [HttpGet("by-email")]
    public async Task<IActionResult> GetByEmail([FromQuery] string email) =>
        (await _sender.Send(new GetOrdersByEmailQuery(email))).ToActionResult(this);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        var command = new CreateOrderCommand(request.CustomerId, request.ShippingAddressId, request.Items);
        var result = await _sender.Send(command);
        return result.ToCreatedResult(this, nameof(GetById), new { id = result.IsSuccess ? result.Value.Id : Guid.Empty });
    }

    [HttpPut("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var result = await _sender.Send(new ConfirmOrderCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPut("{id:guid}/ship")]
    public async Task<IActionResult> Ship(Guid id)
    {
        var result = await _sender.Send(new ShipOrderCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPut("{id:guid}/deliver")]
    public async Task<IActionResult> Deliver(Guid id)
    {
        var result = await _sender.Send(new DeliverOrderCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPut("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _sender.Send(new CancelOrderCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }
}

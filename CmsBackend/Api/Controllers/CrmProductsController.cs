using CmsProduct.Api.Extensions;
using CmsProduct.Application.Products.Commands.CreateProduct;
using CmsProduct.Application.Products.Commands.DeactivateProduct;
using CmsProduct.Application.Products.Commands.UpdateStock;
using CmsProduct.Application.Products.Commands.UpdateProduct;
using CmsProduct.Application.Products.Queries.GetAllProducts;
using CmsProduct.Application.Products.Queries.GetProductById;
using CmsProduct.Contracts.Products;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/crm/products")]
public class CrmProductsController : ControllerBase
{
    private readonly ISender _sender;

    public CrmProductsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        (await _sender.Send(new GetAllProductsQuery())).ToActionResult(this);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id) =>
        (await _sender.Send(new GetProductByIdQuery(id))).ToActionResult(this);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        var command = new CreateProductCommand(request.Name, request.Description, request.Price, request.ImageUrl, request.Stock);
        var result = await _sender.Send(command);
        return result.ToCreatedResult(this, nameof(GetById), new { id = result.IsSuccess ? result.Value.Id : Guid.Empty });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        var result = await _sender.Send(new UpdateProductCommand(id, request.Name, request.Price, request.ImageUrl, request.Stock));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPatch("{id:guid}/deactivate")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var result = await _sender.Send(new DeactivateProductCommand(id));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }

    [HttpPatch("{id:guid}/stock")]
    public async Task<IActionResult> UpdateStock(Guid id, [FromBody] UpdateStockRequest request)
    {
        var result = await _sender.Send(new UpdateStockCommand(id, request.Stock));
        if (result.IsFailure) return result.ToActionResult(this);
        return NoContent();
    }
}

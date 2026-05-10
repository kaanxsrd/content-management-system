namespace CmsProduct.Contracts.Products;

public class CreateProductRequest
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string? ImageUrl { get; init; }
    public int Stock { get; init; } = 0;
}

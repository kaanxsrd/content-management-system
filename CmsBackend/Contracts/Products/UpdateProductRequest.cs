namespace CmsProduct.Contracts.Products;

public class UpdateProductRequest
{
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string? ImageUrl { get; init; }
    public int Stock { get; init; } = 0;
}

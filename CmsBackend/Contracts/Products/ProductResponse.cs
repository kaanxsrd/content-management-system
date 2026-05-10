namespace CmsProduct.Contracts.Products;

public class ProductResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string? ImageUrl { get; init; }
    public bool IsActive { get; init; }
    public int Stock { get; init; }
}

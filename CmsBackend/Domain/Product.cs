using CmsProduct.Domain.Common;
using CmsProduct.Domain.Events;

namespace CmsProduct.Domain;

public class Product : AggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; } = true;
    // 0 = unlimited stock
    public int Stock { get; private set; } = 0;

    private Product() { }

    public static Product Create(string name, string description, decimal price, string? imageUrl = null, int stock = 0)
    {
        var product = new Product
        {
            Name = name,
            Description = description,
            Price = price,
            ImageUrl = imageUrl,
            IsActive = true,
            Stock = stock
        };
        product.RaiseDomainEvent(new ProductCreatedDomainEvent(product.Id, name));
        return product;
    }

    public void Rename(string name) => Name = name;
    public void UpdatePrice(decimal price) => Price = price;
    public void UpdateImageUrl(string? imageUrl) => ImageUrl = imageUrl;
    public void SetStock(int stock) => Stock = stock >= 0 ? stock : 0;
    public void Deactivate() => IsActive = false;
}

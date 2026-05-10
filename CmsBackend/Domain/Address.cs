using CmsProduct.Domain.Common;

namespace CmsProduct.Domain;

public class Address : Entity
{
    public string Street { get; private set; } = string.Empty;
    public string City { get; private set; } = string.Empty;
    public string ZipCode { get; private set; } = string.Empty;
    public string Country { get; private set; } = string.Empty;

    private Address() { }

    public static Address Create(string street, string city, string zipCode, string country) => new()
    {
        Street = street,
        City = city,
        ZipCode = zipCode,
        Country = country
    };
}

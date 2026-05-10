using CmsProduct.Domain.Common;
using CmsProduct.Domain.Events;

namespace CmsProduct.Domain;

public class Customer : AggregateRoot
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public Guid AddressId { get; private set; }
    public Address Address { get; private set; } = null!;

    private Customer() { }

    public static Customer Create(string firstName, string lastName, string email, Guid addressId)
    {
        var customer = new Customer
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            AddressId = addressId
        };
        customer.RaiseDomainEvent(new CustomerCreatedDomainEvent(customer.Id, email));
        return customer;
    }

    public void UpdateEmail(string email) => Email = email;
    public string FullName => $"{FirstName} {LastName}";
}

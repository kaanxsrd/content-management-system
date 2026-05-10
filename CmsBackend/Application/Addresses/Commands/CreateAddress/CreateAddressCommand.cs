using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Customers;

namespace CmsProduct.Application.Addresses.Commands.CreateAddress;

public record CreateAddressCommand(
    string Street,
    string City,
    string ZipCode,
    string Country
) : ICommand<AddressDto>;

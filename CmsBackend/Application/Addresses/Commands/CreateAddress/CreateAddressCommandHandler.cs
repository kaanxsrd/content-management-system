using CmsProduct.Application.Abstractions;
using CmsProduct.Application.Abstractions.Repositories;
using CmsProduct.Contracts.Customers;
using CmsProduct.Domain;
using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;

namespace CmsProduct.Application.Addresses.Commands.CreateAddress;

public class CreateAddressCommandHandler : ICommandHandler<CreateAddressCommand, AddressDto>
{
    private readonly IAddressRepository _addresses;

    public CreateAddressCommandHandler(IAddressRepository addresses) => _addresses = addresses;

    public async Task<Result<AddressDto, IDomainError>> Handle(
        CreateAddressCommand request,
        CancellationToken cancellationToken)
    {
        var address = Address.Create(request.Street, request.City, request.ZipCode, request.Country);
        await _addresses.AddAsync(address);
        await _addresses.SaveChangesAsync();

        return Result<AddressDto, IDomainError>.Success(new AddressDto
        {
            Id = address.Id,
            Street = address.Street,
            City = address.City,
            ZipCode = address.ZipCode,
            Country = address.Country
        });
    }
}

using CmsProduct.Application.Abstractions;
using MediatR;

namespace CmsProduct.Application.Customers.Commands.UpdateCustomerEmail;

public record UpdateCustomerEmailCommand(Guid CustomerId, string Email) : ICommand;

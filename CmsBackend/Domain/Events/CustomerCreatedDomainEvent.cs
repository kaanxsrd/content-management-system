using CmsProduct.Domain.Common;

namespace CmsProduct.Domain.Events;

public record CustomerCreatedDomainEvent(Guid CustomerId, string Email) : IDomainEvent;

using CmsProduct.Domain.Common;

namespace CmsProduct.Domain.Events;

public record OrderCreatedDomainEvent(Guid OrderId, Guid CustomerId) : IDomainEvent;

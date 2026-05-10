using CmsProduct.Domain.Common;

namespace CmsProduct.Domain.Events;

public record ProductCreatedDomainEvent(Guid ProductId, string Name) : IDomainEvent;

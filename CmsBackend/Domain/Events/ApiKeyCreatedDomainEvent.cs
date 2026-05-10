using CmsProduct.Domain.Common;

namespace CmsProduct.Domain.Events;

public record ApiKeyCreatedDomainEvent(Guid ApiKeyId, string Name) : IDomainEvent;

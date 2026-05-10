using CmsProduct.Domain.Common;
using CmsProduct.Domain.Events;

namespace CmsProduct.Domain;

public class ApiKey : AggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string KeyHash { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAtUtc { get; private set; } = DateTime.UtcNow;
    public DateTime? LastUsedAtUtc { get; private set; }
    public long TotalRequests { get; private set; }

    private ApiKey() { }

    public static ApiKey Create(string name, string keyHash)
    {
        var key = new ApiKey
        {
            Name = name,
            KeyHash = keyHash,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };
        key.RaiseDomainEvent(new ApiKeyCreatedDomainEvent(key.Id, name));
        return key;
    }

    public bool Verify(string rawKey) =>
        BCrypt.Net.BCrypt.Verify(rawKey, KeyHash);

    public void Rename(string newName) => Name = newName;

    public void MarkUsed()
    {
        LastUsedAtUtc = DateTime.UtcNow;
        TotalRequests++;
    }

    public void Enable() => IsActive = true;
    public void Disable() => IsActive = false;
}

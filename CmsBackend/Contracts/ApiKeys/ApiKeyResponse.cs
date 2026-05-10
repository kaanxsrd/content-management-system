namespace CmsProduct.Contracts.ApiKeys;

public class ApiKeyResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? LastUsedAtUtc { get; init; }
    public long TotalRequests { get; init; }
}

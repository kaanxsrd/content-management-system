namespace CmsProduct.Contracts.ApiKeys;

public class CreateApiKeyResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string RawKey { get; init; } = string.Empty;
    public DateTime CreatedAtUtc { get; init; }
}

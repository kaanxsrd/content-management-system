namespace CmsProduct.Contracts.Stats;

public class BackendStatsResponse
{
    public long TotalRequests { get; init; }
    public long SuccessfulRequests { get; init; }
    public long FailedRequests { get; init; }
    public double AverageResponseTimeMs { get; init; }
    public int ActiveApiKeys { get; init; }
    public int DisabledApiKeys { get; init; }
    public DateTime GeneratedAtUtc { get; init; }
}

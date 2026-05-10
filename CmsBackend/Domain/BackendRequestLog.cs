using CmsProduct.Domain.Common;

namespace CmsProduct.Domain;

public class BackendRequestLog : Entity
{
    public string Path { get; private set; } = string.Empty;
    public string Method { get; private set; } = string.Empty;
    public int StatusCode { get; private set; }
    public long ElapsedMilliseconds { get; private set; }
    public DateTime CreatedAtUtc { get; private set; } = DateTime.UtcNow;

    private BackendRequestLog() { }

    public static BackendRequestLog Create(string path, string method, int statusCode, long elapsedMs) => new()
    {
        Path = path,
        Method = method,
        StatusCode = statusCode,
        ElapsedMilliseconds = elapsedMs,
        CreatedAtUtc = DateTime.UtcNow
    };
}

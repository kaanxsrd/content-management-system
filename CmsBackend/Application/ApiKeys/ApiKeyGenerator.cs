using System.Security.Cryptography;

namespace CmsProduct.Application.ApiKeys;

public class ApiKeyGenerator : IApiKeyGenerator
{
    private const string Prefix = "cms_";

    public string Generate()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        var random = Convert.ToBase64String(bytes)
            .Replace("+", "")
            .Replace("/", "")
            .Replace("=", "");
        return $"{Prefix}{random}";
    }

    public string Hash(string rawKey) =>
        BCrypt.Net.BCrypt.HashPassword(rawKey);
}

namespace CmsProduct.Application.ApiKeys;

public interface IApiKeyGenerator
{
    string Generate();
    string Hash(string rawKey);
}

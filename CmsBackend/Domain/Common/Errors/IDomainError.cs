namespace CmsProduct.Domain.Common.Errors;

public interface IDomainError
{
    string ErrorMessage { get; }
    ErrorType ErrorType { get; }
    List<string>? Errors { get; }
}

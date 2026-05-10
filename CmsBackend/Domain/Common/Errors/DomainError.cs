namespace CmsProduct.Domain.Common.Errors;

public record DomainError : IDomainError
{
    public string ErrorMessage { get; }
    public ErrorType ErrorType { get; }
    public List<string>? Errors { get; }

    private DomainError(string message, ErrorType type, List<string>? errors = null)
    {
        ErrorMessage = message;
        ErrorType = type;
        Errors = errors;
    }

    public static DomainError NotFound(string message) => new(message, ErrorType.NotFound);
    public static DomainError Conflict(string message) => new(message, ErrorType.Conflict);
    public static DomainError Validation(string message, List<string>? errors = null) => new(message, ErrorType.Validation, errors);
    public static DomainError BadRequest(string message) => new(message, ErrorType.BadRequest);
    public static DomainError Unexpected(string message) => new(message, ErrorType.Unexpected);
}

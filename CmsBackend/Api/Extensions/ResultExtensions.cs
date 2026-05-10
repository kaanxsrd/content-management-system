using CmsProduct.Domain.Common;
using CmsProduct.Domain.Common.Errors;
using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(
        this Result<T, IDomainError> result,
        ControllerBase controller) where T : notnull
    {
        if (result.IsSuccess)
            return controller.Ok(result.Value);

        return result.Error.ErrorType switch
        {
            ErrorType.NotFound => controller.NotFound(new { error = result.Error.ErrorMessage }),
            ErrorType.Conflict => controller.Conflict(new { error = result.Error.ErrorMessage }),
            ErrorType.Validation => controller.UnprocessableEntity(new
            {
                error = result.Error.ErrorMessage,
                errors = result.Error.Errors
            }),
            ErrorType.BadRequest => controller.BadRequest(new { error = result.Error.ErrorMessage }),
            _ => controller.StatusCode(500, new { error = result.Error.ErrorMessage })
        };
    }

    public static IActionResult ToCreatedResult<T>(
        this Result<T, IDomainError> result,
        ControllerBase controller,
        string actionName,
        object routeValues) where T : notnull
    {
        if (result.IsSuccess)
            return controller.CreatedAtAction(actionName, routeValues, result.Value);

        return result.Error.ErrorType switch
        {
            ErrorType.NotFound => controller.NotFound(new { error = result.Error.ErrorMessage }),
            ErrorType.Conflict => controller.Conflict(new { error = result.Error.ErrorMessage }),
            ErrorType.Validation => controller.UnprocessableEntity(new
            {
                error = result.Error.ErrorMessage,
                errors = result.Error.Errors
            }),
            ErrorType.BadRequest => controller.BadRequest(new { error = result.Error.ErrorMessage }),
            _ => controller.StatusCode(500, new { error = result.Error.ErrorMessage })
        };
    }
}

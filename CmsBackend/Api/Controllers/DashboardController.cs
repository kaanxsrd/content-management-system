using Microsoft.AspNetCore.Mvc;

namespace CmsProduct.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    [HttpGet("ping")]
    public IActionResult Ping() =>
        Ok(new { message = "pong", timestamp = DateTime.UtcNow });

    [HttpGet("protected-data")]
    public IActionResult ProtectedData() =>
        Ok(new
        {
            message = "Access granted",
            data = "This is protected dashboard data",
            timestamp = DateTime.UtcNow
        });
}

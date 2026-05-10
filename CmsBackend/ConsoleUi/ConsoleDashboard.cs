using CmsProduct.Contracts.ApiKeys;
using CmsProduct.Contracts.Stats;
using Spectre.Console;
using System.Net.Http.Json;

namespace CmsProduct.ConsoleUi;

public class ConsoleDashboard
{
    private readonly HttpClient _http;

    public ConsoleDashboard(string baseUrl)
    {
        _http = new HttpClient { BaseAddress = new Uri(baseUrl) };
    }

    public async Task ShowStatsAsync()
    {
        var stats = await AnsiConsole.Status()
            .StartAsync("Loading stats...", _ => _http.GetFromJsonAsync<BackendStatsResponse>("/api/admin/stats"));

        if (stats is null) { AnsiConsole.MarkupLine("[red]Failed to load stats.[/]"); return; }

        var panel = new Panel(
            $"[green]Total Requests:[/]     {stats.TotalRequests}\n" +
            $"[green]Successful:[/]         {stats.SuccessfulRequests}\n" +
            $"[red]Failed:[/]             {stats.FailedRequests}\n" +
            $"[cyan]Avg Response Time:[/] {stats.AverageResponseTimeMs:F2} ms\n" +
            $"[green]Active Keys:[/]        {stats.ActiveApiKeys}\n" +
            $"[grey]Disabled Keys:[/]      {stats.DisabledApiKeys}\n" +
            $"[grey]Generated:[/]          {stats.GeneratedAtUtc:u}")
        {
            Header = new PanelHeader("[bold green] Backend Stats [/]"),
            Border = BoxBorder.Rounded,
            Padding = new Padding(1, 0)
        };

        AnsiConsole.Write(panel);
    }

    public async Task ListApiKeysAsync()
    {
        var keys = await AnsiConsole.Status()
            .StartAsync("Loading keys...", _ => _http.GetFromJsonAsync<List<ApiKeyResponse>>("/api/admin/api-keys"));

        if (keys is null) { AnsiConsole.MarkupLine("[red]Failed to load API keys.[/]"); return; }

        if (keys.Count == 0) { AnsiConsole.MarkupLine("[grey]No API keys found.[/]"); return; }

        var table = new Table()
            .Border(TableBorder.Rounded)
            .AddColumn("ID (short)")
            .AddColumn("Name")
            .AddColumn("Active")
            .AddColumn("Created")
            .AddColumn("Last Used")
            .AddColumn("Requests");

        foreach (var key in keys)
        {
            table.AddRow(
                $"[grey]{key.Id.ToString()[..8]}...[/]",
                Markup.Escape(key.Name),
                key.IsActive ? "[green]Yes[/]" : "[red]No[/]",
                key.CreatedAtUtc.ToString("yyyy-MM-dd"),
                key.LastUsedAtUtc?.ToString("yyyy-MM-dd HH:mm") ?? "[grey]Never[/]",
                key.TotalRequests.ToString()
            );
        }

        AnsiConsole.Write(table);
    }

    public async Task CreateApiKeyAsync()
    {
        var name = AnsiConsole.Ask<string>("Enter [green]key name[/]:");

        var response = await _http.PostAsJsonAsync("/api/admin/api-keys", new CreateApiKeyRequest { Name = name });
        var created = await response.Content.ReadFromJsonAsync<CreateApiKeyResponse>();

        if (created is null) { AnsiConsole.MarkupLine("[red]Failed to create API key.[/]"); return; }

        AnsiConsole.WriteLine();
        AnsiConsole.MarkupLine("[bold green]API Key Created![/]");

        var panel = new Panel(
            $"[grey]ID:[/]  {created.Id}\n" +
            $"[grey]Key:[/] [bold yellow]{Markup.Escape(created.RawKey)}[/]")
        {
            Header = new PanelHeader("[yellow] Save this key — it won't be shown again [/]"),
            Border = BoxBorder.Heavy
        };

        AnsiConsole.Write(panel);
    }

    public async Task RenameApiKeyAsync()
    {
        await ListApiKeysAsync();
        AnsiConsole.WriteLine();
        var id = AnsiConsole.Ask<Guid>("Enter [green]key ID[/] to rename:");
        var newName = AnsiConsole.Ask<string>("Enter [green]new name[/]:");

        var response = await _http.PutAsJsonAsync($"/api/admin/api-keys/{id}/rename", new RenameApiKeyRequest { Name = newName });

        AnsiConsole.MarkupLine(response.IsSuccessStatusCode
            ? "[green]Renamed successfully.[/]"
            : $"[red]Failed ({(int)response.StatusCode}).[/]");
    }

    public async Task EnableApiKeyAsync()
    {
        await ListApiKeysAsync();
        AnsiConsole.WriteLine();
        var id = AnsiConsole.Ask<Guid>("Enter [green]key ID[/] to enable:");

        var response = await _http.PutAsync($"/api/admin/api-keys/{id}/enable", null);

        AnsiConsole.MarkupLine(response.IsSuccessStatusCode
            ? "[green]Key enabled.[/]"
            : $"[red]Failed ({(int)response.StatusCode}).[/]");
    }

    public async Task DisableApiKeyAsync()
    {
        await ListApiKeysAsync();
        AnsiConsole.WriteLine();
        var id = AnsiConsole.Ask<Guid>("Enter [green]key ID[/] to disable:");

        var response = await _http.PutAsync($"/api/admin/api-keys/{id}/disable", null);

        AnsiConsole.MarkupLine(response.IsSuccessStatusCode
            ? "[green]Key disabled.[/]"
            : $"[red]Failed ({(int)response.StatusCode}).[/]");
    }
}

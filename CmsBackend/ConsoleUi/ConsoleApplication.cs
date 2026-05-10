using Spectre.Console;

namespace CmsProduct.ConsoleUi;

public static class ConsoleApplication
{
    public static async Task RunAsync()
    {
        ConsoleTheme.PrintHeader();

        var baseUrl = AnsiConsole.Ask("Enter [green]API base URL[/]:", "http://localhost:5000");
        var dashboard = new ConsoleDashboard(baseUrl);

        while (true)
        {
            AnsiConsole.WriteLine();
            var choice = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("[bold]Select an action:[/]")
                    .AddChoices(
                        "View Backend Stats",
                        "List API Keys",
                        "Create API Key",
                        "Rename API Key",
                        "Enable API Key",
                        "Disable API Key",
                        "Exit"));

            if (choice == "Exit") break;

            AnsiConsole.WriteLine();

            try
            {
                switch (choice)
                {
                    case "View Backend Stats": await dashboard.ShowStatsAsync(); break;
                    case "List API Keys": await dashboard.ListApiKeysAsync(); break;
                    case "Create API Key": await dashboard.CreateApiKeyAsync(); break;
                    case "Rename API Key": await dashboard.RenameApiKeyAsync(); break;
                    case "Enable API Key": await dashboard.EnableApiKeyAsync(); break;
                    case "Disable API Key": await dashboard.DisableApiKeyAsync(); break;
                }
            }
            catch (Exception ex)
            {
                AnsiConsole.MarkupLine($"[red]Error:[/] {Markup.Escape(ex.Message)}");
            }

            AnsiConsole.WriteLine();
            AnsiConsole.MarkupLine("[grey]Press any key to continue...[/]");
            Console.ReadKey(true);

            ConsoleTheme.PrintHeader();
        }
    }
}

using CmsProduct.Api.Startup;
using CmsProduct.ConsoleUi;
using Spectre.Console;

var mode = args.Length > 0 ? args[0].ToLower() : null;
var remainingArgs = args.Length > 1 ? args[1..] : Array.Empty<string>();

if (mode == "api")
{
    await ApiApplication.RunAsync(remainingArgs);
}
else if (mode == "console")
{
    await ConsoleApplication.RunAsync();
}
else
{
    var choice = AnsiConsole.Prompt(
        new SelectionPrompt<string>()
            .Title("[bold green]CmsProduct[/] — Select mode:")
            .AddChoices("API Backend", "Console Dashboard", "Exit"));

    switch (choice)
    {
        case "API Backend":
            await ApiApplication.RunAsync(remainingArgs);
            break;
        case "Console Dashboard":
            await ConsoleApplication.RunAsync();
            break;
    }
}

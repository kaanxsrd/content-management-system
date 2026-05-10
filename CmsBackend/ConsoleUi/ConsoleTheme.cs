using Spectre.Console;

namespace CmsProduct.ConsoleUi;

public static class ConsoleTheme
{
    public static void PrintHeader()
    {
        AnsiConsole.Clear();
        AnsiConsole.Write(new FigletText("Cms Dashboard").Color(Color.Green));
        AnsiConsole.MarkupLine("[grey]Backend Management Console[/]");
        AnsiConsole.WriteLine();
    }
}

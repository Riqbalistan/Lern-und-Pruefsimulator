using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    private readonly JsonImportService _jsonImportService;

    public ImportController(JsonImportService jsonImportService)
    {
        _jsonImportService = jsonImportService;
    }

    [HttpPost]
    public async Task<IActionResult> Import()
    {
        var dateien = Directory.GetFiles("ImportData", "*.json");

        var erfolgreich = new List<string>();
        var uebersprungen = new List<string>();

        foreach (var datei in dateien)
        {
            try
            {
                await _jsonImportService.ImportAsync(datei);
                erfolgreich.Add(Path.GetFileName(datei));
            }
            catch (Exception)
            {
                // Bereits importiert oder anderer Fehler
                uebersprungen.Add(Path.GetFileName(datei));
            }
        }

        return Ok(new
        {
            ErfolgreichImportiert = erfolgreich,
            Uebersprungen = uebersprungen
        });
    }
}
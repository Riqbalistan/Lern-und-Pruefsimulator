using System.Text.Json;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class JsonImportService
{
    private readonly AppDbContext _context;

    public JsonImportService(AppDbContext context)
    {
        _context = context;
    }
    public async Task ImportAsync(string filePath)
    {
        Console.WriteLine("Aktuelles Arbeitsverzeichnis:");
        Console.WriteLine(Directory.GetCurrentDirectory());
        Console.WriteLine("Dateipfad:");
        Console.WriteLine(filePath);
        
        if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Datei {filePath} konnte nicht gefunden werden");
            }
            // return null;
        
        var json = await File.ReadAllTextAsync(filePath);
        var questions = JsonSerializer.Deserialize<List<QuestionImportDto>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (questions == null)
            {
                throw new Exception("JSON konnte nicht gelesen werden");
                // return null;
            }
            // return questions;
            
            var catalogName = Path.GetFileNameWithoutExtension(filePath).ToUpper();
            if (await _context.Catalogs.AnyAsync(c => c.Name == catalogName))
            {
                throw new JsonException("Dieser Katalog wurde bereits importiert");
            }

            // var catalog = new Catalog
            // {
            //     Name = Path.GetFileNameWithoutExtension(filePath).ToUpper(),
            //     FileName = Path.GetFileName(filePath)
            // };
            var catalog = new Catalog
            {
                Name = catalogName,
                FileName = Path.GetFileName(filePath)
            };
            _context.Catalogs.Add(catalog);
            await _context.SaveChangesAsync();

            foreach (var questionDto in questions)
            {
                var question = new Question
                {
                    Type = questionDto.Type,
                    QuestionText = questionDto.QuestionText,
                    Hint = questionDto.Hint,
                    CatalogId = catalog.Id
                };
                foreach (var answerDto in questionDto.Answers)
                {
                    question.Answers.Add(new Answer
                    {
                        AnswerText = answerDto.AnswerText,
                        IsCorrect = answerDto.IsCorrect
                    });
                }
                _context.Questions.Add(question);
            }
            await _context.SaveChangesAsync();
    
    }
}
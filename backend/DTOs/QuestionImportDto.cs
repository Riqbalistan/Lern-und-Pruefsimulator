using backend.Models;

namespace backend.Dtos;

public class QuestionImportDto
{
    public int Id {get; set;}
    public string Type {get; set;} = string.Empty;
    public string QuestionText {get; set;} = string.Empty;
    public string Hint {get; set;} = string.Empty;
    public List<AnswerImportDto> Answers {get; set;} = [];
}
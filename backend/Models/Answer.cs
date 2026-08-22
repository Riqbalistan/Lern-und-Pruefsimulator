using System.Text.Json.Serialization;
namespace backend.Models;

public class Answer
{
    public int Id { get; set;}
    public string AnswerText { get; set;} = string.Empty;
    public bool IsCorrect { get; set;}
    public int QuestionId {get; set;}
    // public Question? Question {get; set;}
    [JsonIgnore]
    public Question? Question { get; set; }
}
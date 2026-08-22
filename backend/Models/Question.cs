namespace backend.Models;
public class Question
{
    public int Id {get; set;}
    public string Type {get; set;} = string.Empty;
    public string QuestionText {get; set;} = string.Empty;

    // Themengebiet der Frage (z. B. "System Architecture")
    public string Hint {get; set;} = string.Empty;

    // Verweis auf den Katalog
    public int CatalogId {get; set;}
    public Catalog? Catalog {get; set;}
    public List<Answer> Answers {get; set;} = [];
}
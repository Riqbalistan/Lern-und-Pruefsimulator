

namespace backend.Models;

public class Catalog
{
    public int Id { get; set;}
    public string Name { get; set;} = string.Empty;
    public string FileName {get; set;} = string.Empty;
    public List<Question> Questions {get; set;} = []; 
}
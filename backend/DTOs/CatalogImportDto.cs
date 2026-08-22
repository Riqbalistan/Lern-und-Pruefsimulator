// using backend.Dtos;

namespace backend.Dtos;
public class CatalogImportDto
{
    public string Name {get; set;} = string.Empty;
    public List<QuestionImportDto> Questions {get; set;} = [];
}
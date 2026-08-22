using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogsController: ControllerBase
{
    
    private readonly AppDbContext _context;
    public CatalogsController(AppDbContext context)
    {
        _context = context;
    }

    //Get: api/catalogs
    [HttpGet]
    public async Task<ActionResult<Catalog>> GetCatalogs()
    {
        var catalogs = await _context.Catalogs.ToListAsync();
        return Ok(catalogs);
    }

    //Get: api/catalog/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Catalog>> GetCatalog(int id)
    {
        var catalog = await _context.Catalogs
            .FirstOrDefaultAsync(c => c.Id == id);
            if ( catalog == null)
        {
            return NotFound();
        } 
        return Ok(catalog);
    }

    //Get: api/catalogs/1/questions
    // [HttpGet("{id}/questions")]
    // public async Task<ActionResult<IEnumerable<Question>>> GetCatalogQuestions(int id)
    // {
    //     var catalog = await _context.Catalogs
    //         .Include(catalog => catalog.Questions)
    //             .ThenInclude(q => q.Answers)
    //         .FirstOrDefaultAsync(c=> c.Id == id);
    //     if (catalog == null)
    //     {
    //         return NotFound();
    //     }
    //     return Ok(catalog.Questions);
    // }
    [HttpGet("{id}/questions")]
    public async Task<ActionResult<IEnumerable<Question>>> GetCatalogQuestions(int id)
    {
        var questions = await _context.Questions
            .Where(q => q.CatalogId == id)
            .Include(q => q.Answers)
            .ToListAsync();

        return Ok(questions);
    }
    
}
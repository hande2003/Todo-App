using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TODO_App.Server.Data;
using TODO_App.Server.Model;

namespace TODO_App.Server.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TodoTasksController : ControllerBase
    {
        private readonly TodoAppDBContext _context;
        private readonly UserManager<TodoAppUser> _userManager;
        private readonly SignInManager<TodoAppUser> _signInManager;
        private readonly ILogger<TodoTasksController> _logger;

        public TodoTasksController(TodoAppDBContext context,
            UserManager<TodoAppUser> userManager,
            SignInManager<TodoAppUser> signInManager,
            ILogger<TodoTasksController> logger)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        private async Task<bool> IsUserSignedIn()
        {
            return _signInManager.IsSignedIn(User);
        }

        private static TodoTaskDTO MapToDto(TodoTask task)
        {
            return new TodoTaskDTO
            {
                TaskId = task.TaskId,
                TaskName = task.TaskName,
                IsComplete = task.IsComplete
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTaskDTO>>> GetTodoTasksModel()
        {
            if (await IsUserSignedIn())
            {
                var user = await _userManager.GetUserAsync(User);
                var todoTasks = await _context.TodoTaskModel
                                    .Where(task => task.UserId == user.Id)
                                    .Select(task => MapToDto(task))
                                    .ToListAsync();
                _logger.LogInformation($"User {user.Id} retrieved their tasks");
                return Ok(todoTasks);
            }
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTaskDTO>> GetTodoTasks(int id)
        {
            if (await IsUserSignedIn())
            {
                var user = await _userManager.GetUserAsync(User);
                var todoTask = await _context.TodoTaskModel
                    .FirstOrDefaultAsync(task => task.UserId == user.Id && task.TaskId == id);
                if (todoTask == null)
                {
                    return NotFound();
                }
                return Ok(MapToDto(todoTask));
            }
            return Unauthorized();
        }

        [HttpPost]
        public async Task<ActionResult<TodoTaskDTO>> PostTodoTasks(TodoTask todoTask)
        {
            if (await IsUserSignedIn())
            {
                var user = await _userManager.GetUserAsync(User);
                var taskExists = await _context.TodoTaskModel
                    .AnyAsync(task => task.UserId == user.Id && task.TaskName == todoTask.TaskName);

                if (taskExists)
                {
                    //return Conflict("A task with the same name already exists.");
                    return NoContent();
                }

                todoTask.UserId = user.Id;
                _context.TodoTaskModel.Add(todoTask);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetTodoTasks", new { id = todoTask.TaskId }, MapToDto(todoTask));
            }
            return Unauthorized("User is not logged in.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoTask(int id, [FromBody] TodoTaskDTO todoTaskDto)
        {
            if (todoTaskDto == null || todoTaskDto.TaskId != id)
            {
                return BadRequest("Task ID mismatch or invalid task data.");
            }

            if (await IsUserSignedIn())
            {
                var user = await _userManager.GetUserAsync(User);
                var todoTask = await _context.TodoTaskModel
                    .FirstOrDefaultAsync(task => task.UserId == user.Id && task.TaskId == id);

                if (todoTask == null)
                {
                    return NotFound();
                }

                // Update the entity with the values from the DTO
                //todoTask.TaskName = todoTaskDto.TaskName;
                todoTask.IsComplete = todoTaskDto.IsComplete;

                _context.Entry(todoTask).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.TodoTaskModel.Any(e => e.TaskId == id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            return Unauthorized("User is not logged in.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoTasks(int id)
        {
            if (await IsUserSignedIn())
            {
                var user = await _userManager.GetUserAsync(User);
                var todoTasks = await _context.TodoTaskModel
                    .FirstOrDefaultAsync(task => task.UserId == user.Id && task.TaskId == id);
                if (todoTasks == null)
                {
                    return NotFound();
                }
                _context.TodoTaskModel.Remove(todoTasks);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return Unauthorized("User is not authorized to delete.");
        }
    }
}

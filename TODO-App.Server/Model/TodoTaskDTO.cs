using System.ComponentModel.DataAnnotations;

namespace TODO_App.Server.Model
{
    public class TodoTaskDTO
    {
        [Key]
        public int TaskId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
    }
}

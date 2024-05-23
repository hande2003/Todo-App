using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_App.Server.Model
{
    public class TodoTask
    {
        [Key]
        public int TaskId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public bool IsComplete { get; set; }

        // This property represents the foreign key relationship with the ApplicationUser
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;
    }
}

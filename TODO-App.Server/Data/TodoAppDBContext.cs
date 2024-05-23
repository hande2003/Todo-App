using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TODO_App.Server.Data
{
    public class TodoAppDBContext : IdentityDbContext<TodoAppUser>
    {
        public TodoAppDBContext(DbContextOptions<TodoAppDBContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public DbSet<TODO_App.Server.Model.TodoTask> TodoTaskModel { get; set; } = default!;
        public DbSet<TODO_App.Server.Model.TodoTaskDTO> TodoTaskDTO { get; set; } = default!;

    }
}

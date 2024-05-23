using Microsoft.AspNetCore.Identity;

namespace TODO_App.Server.Data
{
    public class TodoAppUser : IdentityUser
    {
        [PersonalData]
        public string FirstName { get; set; } = string.Empty;

        [PersonalData]
        public string LastName { get; set; } = string.Empty;
    }
}

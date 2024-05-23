using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TODO_App.Server.Data;
using TODO_App.Server.Model;

namespace TODO_App.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<TodoAppUser> _userManager;
        private readonly SignInManager<TodoAppUser> _signInManager;
        private readonly ILogger<AuthController> _logger;
        public AuthController(
            UserManager<TodoAppUser> userManager,
            SignInManager<TodoAppUser> signInManager,
            ILogger<AuthController> logger
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost]
        [Route("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new TodoAppUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserName = model.Email,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return Ok(new { message = "Please confirm your email address.", userId = user.Id });
                    }
                    else
                    {
                        //await _signInManager.SignInAsync(user, isPersistent: false);
                        return Ok(new { message = "Registration successful.", userId = user.Id });
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed
            return BadRequest(ModelState);
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login(LoginModel model)

        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                // User with the provided email does not exist
                // You can redirect the user to a registration page or display a message
                return NotFound(new { message = "Email address not found. Please create an account.", code = "EANF" });
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

            switch (true)
            {

                case var _ when result.Succeeded:
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    _logger.LogInformation("User logged in.");
                    return Ok(new { code = "OK", id = userId });
                case var _ when result.RequiresTwoFactor:
                    // Redirect to two-factor authentication page if needed
                    return BadRequest(new { message = "Two-factor authentication is required.", code = "TFA" });
                case var _ when result.IsLockedOut:
                    _logger.LogWarning("User account locked out.");
                    return BadRequest(new { message = "User account is locked out.", code = "MA" });
                //case var _ when result.IsNotAllowed:
                //    // This case handles when the user has provided correct email but wrong password
                //    _logger.LogWarning("Invalid login attempt. Password does not match.");
                //    return BadRequest(new { message = "Incorrect password.", code = "IP" });
                default:
                    _logger.LogWarning("Invalid login attempt. Password does not match.");
                    return BadRequest(new { message = "Incorrect password.", code = "IP" });
            }
        }


        [Authorize]
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return Ok(new { message = "Logout successful." });
        }

        [HttpGet]
        [Route("auth-user")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult AuthUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                // User is not authenticated, return Unauthorized status
                return Unauthorized();
            }

            // Retrieve the user from the database using UserManager
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null)
            {
                // User not found, return NotFound status
                return NotFound(new { message = "User not found", code = "UNF" });
            }



            // get the user's email from the claim
            return Ok(new { firstname = user.FirstName, lastname = user.LastName }); // return the email as a JSON response
        }
    }
}

using Microsoft.EntityFrameworkCore;
using TODO_App.Server.Data;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("TodoAppDBConnection") ?? throw new InvalidOperationException("Connection string 'TodoAppDBConnection' not found.");

builder.Services.AddDbContext<TodoAppDBContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddIdentityApiEndpoints<TodoAppUser>()
    .AddEntityFrameworkStores<TodoAppDBContext>();

builder.Services.AddAuthorization();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapIdentityApi<TodoAppUser>();

//app.MapPost("/logout", async (SignInManager<TodoAppUser> signInManager,
//    [FromBody] object empty) =>
//{
//    if (empty != null)
//    {
//        await signInManager.SignOutAsync();
//        return Results.Ok();
//    }
//    return Results.Unauthorized();
//}).RequireAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

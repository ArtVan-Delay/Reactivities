using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccesor;
        private readonly DataContext _context;
        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccesor,
            DataContext context)
        {
            _context = context;
            _httpContextAccesor = httpContextAccesor;

        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            IsHostRequirement requirement)
        {
            // Get User name from Http Context
            var currentUserName = _httpContextAccesor.HttpContext.User?.Claims?
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            // Get activity id from Route info in Http Context
            var activityId = Guid.Parse(_httpContextAccesor.HttpContext.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value.ToString());
            
            // Get the Activity from the db
            var activity = _context.Activities.FindAsync(activityId).Result;

            // Find the Host of the activity in list of attendees
            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            // If host user name is same as Current User, success
            if (host?.AppUser?.UserName == currentUserName)
                context.Succeed(requirement);
            
            return Task.CompletedTask;
        }
    }
}
using Microsoft.Bot.Schema.SharePoint;
using System;

namespace BotPowered_BasicAce_Tasks
{
    public class TaskItem
    {
        public Guid ID { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime DueDate { get; set; }
    }
}

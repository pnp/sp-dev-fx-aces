// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using AdaptiveCards;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.SharePoint;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.SharePoint;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Runtime.InteropServices;
using System.IO;
using AdaptiveCards.Templating;

namespace BotPowered_BasicAce
{
    public class TasksBot : SharePointActivityHandler
    {
        private static string adaptiveCardExtensionId = Guid.NewGuid().ToString();
        private IConfiguration configuration = null;
        public readonly string baseUrl;

        private static ConcurrentDictionary<string, CardViewResponse> cardViews = new ConcurrentDictionary<string, CardViewResponse>();
        private static ConcurrentDictionary<string, QuickViewResponse> quickViews = new ConcurrentDictionary<string, QuickViewResponse>();
        private static bool cardsInitialized = false;

        private static string MainCardView_ID = "MAIN_TASKS_CARD_VIEW";
        private static string SingleTaskCardView_ID = "SINGLE_TASK_CARD_VIEW";
        private static string ListTasksQuickView_ID = "LIST_TASKS_QUICK_VIEW";

        private static List<TaskItem> tasks = new List<TaskItem>(new TaskItem[] {
            new TaskItem { ID = Guid.NewGuid(), Title = "Wash your car", Description = "Remember to wash your car", DueDate = DateTime.Now.AddDays(2) },
            new TaskItem { ID = Guid.NewGuid(), Title = "Buy groceries", Description = "Buy ham, cheese and bread", DueDate= DateTime.Now.AddDays(1) },
            new TaskItem { ID = Guid.NewGuid(), Title = "Pickup kids at school", Description = "Stop coding! You have kids to pickup at school!", DueDate = DateTime.Now },
            new TaskItem { ID = Guid.NewGuid(), Title = "Take a little break", Description = "Remember to stop few minutes and breath", DueDate = DateTime.Now }
        });

        public TasksBot(IConfiguration configuration)
            : base()
        {
            this.configuration = configuration;
            this.baseUrl = configuration["BaseUrl"];

            // Skip cards init if it has already been done
            // if (cardsInitialized) return;

            // Add the CardViews
            var aceData = new AceData()
            {
                Title = "Your tasks",
                CardSize = AceData.AceCardSize.Large,
                DataVersion = "1.0",
                Id = adaptiveCardExtensionId
            };

            // Main Card View (Image Card View)
            CardViewResponse mainCardViewResponse = new CardViewResponse();
            mainCardViewResponse.AceData = aceData;
            mainCardViewResponse.CardViewParameters = CardViewParameters.ImageCardViewParameters(
                new CardBarComponent()
                {
                    Id = "MainCardView",
                },
                new CardTextComponent()
                {
                    Text = $"You have {tasks.Count} active tasks"
                },
                new List<BaseCardComponent>()
                {
                    new CardButtonComponent()
                    {
                        Id = "AllTasks",
                        Title = "All Tasks",
                        Action = new QuickViewAction()
                        {
                            Parameters = new QuickViewActionParameters()
                            {
                                View = ListTasksQuickView_ID
                            }
                        }
                    },
                    new CardButtonComponent()
                    {
                        Id = "SingleTask",
                        Title = "Single task",
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>()
                            {
                                {"viewToNavigateTo", SingleTaskCardView_ID}
                            }
                        }
                    }
                },
                new Microsoft.Bot.Schema.SharePoint.CardImage()
                {
                    Image = $"{baseUrl}/Media/List-of-Tasks.png",
                    AltText = "Tasks Logo"
                });
            mainCardViewResponse.ViewId = MainCardView_ID;

            mainCardViewResponse.OnCardSelection = new QuickViewAction()
            {
                Parameters = new QuickViewActionParameters()
                {
                    View = ListTasksQuickView_ID
                }
            };

            cardViews.TryAdd(mainCardViewResponse.ViewId, mainCardViewResponse);

            // Single Task Card View (Primary Text Card View)
            CardViewResponse singleTaskCardViewResponse = new CardViewResponse();
            singleTaskCardViewResponse.AceData = aceData;
            singleTaskCardViewResponse.CardViewParameters = CardViewParameters.PrimaryTextCardViewParameters(
                new CardBarComponent()
                {
                    Id = "SingleTaskCardView"
                },
                new CardTextComponent()
                {
                    Text = "<TaskTitle>"
                },
                new CardTextComponent()
                {
                    Text = "<TaskDescription>"
                },
                new List<BaseCardComponent>()
                {
                    new CardButtonComponent()
                    {
                        Id = "MainView",
                        Title = "Recap",
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>()
                        }
                    },
                    new CardButtonComponent()
                    {
                        Id = "NextTask",
                        Title = "Next task",
                        Style = CardButtonStyle.Positive,
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>()
                            {
                                {"viewToNavigateTo", SingleTaskCardView_ID},
                                {"nextTaskId", 0}
                            }
                        }
                    }
                });

            singleTaskCardViewResponse.ViewId = SingleTaskCardView_ID;

            cardViews.TryAdd(singleTaskCardViewResponse.ViewId, singleTaskCardViewResponse);

            // Add the QuickViews
            QuickViewResponse listTasksQuickViewResponse = new QuickViewResponse();
            listTasksQuickViewResponse.Title = "Detailed tasks list";
            listTasksQuickViewResponse.Template = createDynamicAdaptiveCard(
                readQuickViewJson("ListTasksQuickView.json"), 
                new {
                    title = "Here are your tasks:",
                    tasks 
                });
            listTasksQuickViewResponse.ViewId = ListTasksQuickView_ID;

            quickViews.TryAdd(listTasksQuickViewResponse.ViewId, listTasksQuickViewResponse);

            // Set cards as already initialized
            cardsInitialized = true;
        }

        protected override Task<CardViewResponse> OnSharePointTaskGetCardViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            return Task.FromResult(cardViews[MainCardView_ID]);
        }

        protected override Task<QuickViewResponse> OnSharePointTaskGetQuickViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            return Task.FromResult(quickViews[ListTasksQuickView_ID]);
        }

        protected override Task<GetPropertyPaneConfigurationResponse> OnSharePointTaskGetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            // return base.OnSharePointTaskGetPropertyPaneConfigurationAsync(turnContext, aceRequest, cancellationToken);

            GetPropertyPaneConfigurationResponse response = new GetPropertyPaneConfigurationResponse();
            PropertyPanePage page = new PropertyPanePage();
            page.Header = new PropertyPanePageHeader();
            page.Header.Description = "Property pane for control";

            PropertyPaneGroup group = new PropertyPaneGroup();
            PropertyPaneGroupField text = new PropertyPaneGroupField();
            text.TargetProperty = "title";
            text.Type = PropertyPaneGroupField.FieldType.TextField;
            PropertyPaneTextFieldProperties textProperties = new PropertyPaneTextFieldProperties();
            textProperties.Value = "Bot Ace Demo";
            textProperties.Label = "Title";
            text.Properties = textProperties;

            PropertyPaneGroupField toggle = new PropertyPaneGroupField();
            toggle.TargetProperty = "toggle";
            toggle.Type = PropertyPaneGroupField.FieldType.Toggle;
            PropertyPaneToggleProperties toggleProperties = new PropertyPaneToggleProperties();
            toggleProperties.Label = "Turn this feature on?";
            toggleProperties.Key = "uniqueKey";
            toggle.Properties = toggleProperties;

            PropertyPaneGroupField dropDown = new PropertyPaneGroupField();
            dropDown.TargetProperty = "dropdown";
            dropDown.Type = PropertyPaneGroupField.FieldType.Dropdown;
            PropertyPaneDropDownProperties dropDownProperties = new PropertyPaneDropDownProperties();
            List<PropertyPaneDropDownOption> options = new List<PropertyPaneDropDownOption>();
            PropertyPaneDropDownOption countryHeader = new PropertyPaneDropDownOption();
            countryHeader.Type = PropertyPaneDropDownOption.DropDownOptionType.Header;
            countryHeader.Text = "Country";

            PropertyPaneDropDownOption divider = new PropertyPaneDropDownOption();
            divider.Type = PropertyPaneDropDownOption.DropDownOptionType.Divider;

            PropertyPaneDropDownOption canada = new PropertyPaneDropDownOption();
            canada.Type = PropertyPaneDropDownOption.DropDownOptionType.Normal;
            canada.Text = "Canada";
            canada.Key = "can";

            PropertyPaneDropDownOption usa = new PropertyPaneDropDownOption();
            usa.Text = "USA";
            usa.Key = "US";

            PropertyPaneDropDownOption mexico = new PropertyPaneDropDownOption();
            mexico.Type = PropertyPaneDropDownOption.DropDownOptionType.Normal;
            mexico.Text = "Mexico";
            mexico.Key = "mex";

            options.Add(countryHeader);
            options.Add(divider);
            options.Add(canada);
            options.Add(usa);
            options.Add(mexico);
            dropDownProperties.Options = options;
            dropDownProperties.SelectedKey = "can";
            dropDown.Properties = dropDownProperties;

            PropertyPaneGroupField label = new PropertyPaneGroupField();
            label.TargetProperty = "label";
            label.Type = PropertyPaneGroupField.FieldType.Label;
            PropertyPaneLabelProperties labelProperties = new PropertyPaneLabelProperties();
            labelProperties.Text = "LABEL ONLY! (required)";
            labelProperties.Required = true;
            label.Properties = labelProperties;

            PropertyPaneGroupField slider = new PropertyPaneGroupField();
            slider.TargetProperty = "slider";
            slider.Type = PropertyPaneGroupField.FieldType.Slider;
            PropertyPaneSliderProperties sliderProperties = new PropertyPaneSliderProperties();
            sliderProperties.Label = "Opacity:";
            sliderProperties.Min = 0;
            sliderProperties.Max = 100;
            slider.Properties = sliderProperties;

            PropertyPaneGroupField choiceGroup = new PropertyPaneGroupField();
            choiceGroup.TargetProperty = "choice";
            choiceGroup.Type = PropertyPaneGroupField.FieldType.ChoiceGroup;
            PropertyPaneChoiceGroupProperties choiceGroupproperties = new PropertyPaneChoiceGroupProperties();
            choiceGroupproperties.Label = "Icon selection:";
            List<PropertyPaneChoiceGroupOption> choiceGroupOptions = new List<PropertyPaneChoiceGroupOption>();

            PropertyPaneChoiceGroupOption sunny = new PropertyPaneChoiceGroupOption();
            sunny.IconProps = new PropertyPaneChoiceGroupIconProperties();
            sunny.IconProps.OfficeFabricIconFontName = "Sunny";
            sunny.Text = "Sun";
            sunny.Key = "sun";

            PropertyPaneChoiceGroupOption plane = new PropertyPaneChoiceGroupOption();
            plane.IconProps = new PropertyPaneChoiceGroupIconProperties();
            plane.IconProps.OfficeFabricIconFontName = "Airplane";
            plane.Text = "plane";
            plane.Key = "AirPlane";

            choiceGroupOptions.Add(sunny);
            choiceGroupOptions.Add(plane);
            choiceGroupproperties.Options = choiceGroupOptions;
            choiceGroup.Properties = choiceGroupproperties;

            PropertyPaneGroupField horizontalRule = new PropertyPaneGroupField();
            horizontalRule.Type = PropertyPaneGroupField.FieldType.HorizontalRule;

            PropertyPaneGroupField link = new PropertyPaneGroupField();
            link.Type = PropertyPaneGroupField.FieldType.Link;
            PropertyPaneLinkProperties linkProperties = new PropertyPaneLinkProperties();
            linkProperties.Href = "https://www.bing.com";
            linkProperties.Text = "Bing";

            PropertyPaneLinkPopupWindowProperties popupProps = new PropertyPaneLinkPopupWindowProperties();
            popupProps.Width = 250;
            popupProps.Height = 250;
            popupProps.Title = "BING POPUP";
            popupProps.PositionWindowPosition = PropertyPaneLinkPopupWindowProperties.PopupWindowPosition.Center;

            linkProperties.PopupWindowProps = popupProps;
            link.Properties = linkProperties;

            List<PropertyPaneGroupField> fields = new List<PropertyPaneGroupField>()
            {
                text,
                toggle,
                dropDown,
                label,
                slider,
                choiceGroup,
                horizontalRule,
                link
            };

            group.GroupFields = fields;

            List<PropertyPaneGroup> groups = new List<PropertyPaneGroup>()
            {
                group
            };
            page.Groups = groups;

            List<PropertyPanePage> pages = new List<PropertyPanePage>
            {
                page
            };
            response.Pages = pages;

            return Task.FromResult(response);
        }

        protected override Task<BaseHandleActionResponse> OnSharePointTaskSetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            Trace.Write("\n\n\nStarting to set the Property Pane Configuration.\n\n\n");
            CardViewResponse mainCardViewResponse = cardViews[MainCardView_ID];

            JObject activityObject = turnContext.Activity.Value as JObject;
            JObject aceProperties = (JObject)activityObject.Property("data").Value;

            foreach (dynamic property in aceProperties)
            {
                switch (property.Key)
                {
                    case "title":
                        mainCardViewResponse.AceData.Title = aceProperties[property.Key];
                        break;
                    default:
                        break;
                }
            }

            CardViewHandleActionResponse response = new CardViewHandleActionResponse();

            response.RenderArguments = mainCardViewResponse;
            Trace.Write("\n\n\nFinished setting the Property Pane Configuration.\n\n\n");
            return Task.FromResult<BaseHandleActionResponse>(response);
        }

        protected override Task<BaseHandleActionResponse> OnSharePointTaskHandleActionAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            if (turnContext != null)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                }
            }
            Trace.Write("\n\n\nStarted to handle action.\n\n\n");
            JObject actionParameters = (JObject)((JObject)turnContext.Activity.Value).Property("data").Value;

            if (actionParameters["type"].ToString().Equals("Submit", StringComparison.InvariantCultureIgnoreCase) &&
                (actionParameters["id"].ToString().Equals("NextTask", StringComparison.InvariantCultureIgnoreCase)) ||
                actionParameters["id"].ToString().Equals("SingleTask", StringComparison.InvariantCultureIgnoreCase))
            {
                CardViewHandleActionResponse response = new CardViewHandleActionResponse();

                string viewToNavigateTo = actionParameters["data"]["viewToNavigateTo"].ToString();
                int nextTaskId = int.Parse(actionParameters["data"]["nextTaskId"]?.ToString() ?? "0");

                var nextCard = cardViews[viewToNavigateTo];

                // Configure title and description of task
                ((nextCard.CardViewParameters.Header.ToList())[0] as CardTextComponent).Text = tasks[nextTaskId].Title;
                ((nextCard.CardViewParameters.Body.ToList())[0] as CardTextComponent).Text = tasks[nextTaskId].Description;

                // Configure next task submit action parameters
                var newNextTaskId = nextTaskId + 1 >= tasks.Count ? 0 : nextTaskId + 1;
                var nextTaskSubmitActionParameters = ((SubmitAction)((nextCard.CardViewParameters.Footer.ToList())[1] as CardButtonComponent).Action);
                nextTaskSubmitActionParameters.Parameters["nextTaskId"] = newNextTaskId;

                // Set the response for the action
                response.RenderArguments = cardViews[viewToNavigateTo];

                Trace.Write("\n\n\nFinished handling action.\n\n\n");
                return Task.FromResult<BaseHandleActionResponse>(response);
            }
            else if (actionParameters["type"].ToString().Equals("Submit", StringComparison.InvariantCultureIgnoreCase) &&
                actionParameters["id"].ToString().Equals("MainView", StringComparison.InvariantCultureIgnoreCase))
            {
                CardViewHandleActionResponse response = new CardViewHandleActionResponse();

                // Return to the main view
                response.RenderArguments = cardViews[MainCardView_ID];

                Trace.Write("\n\n\nFinished handling action.\n\n\n");
                return Task.FromResult<BaseHandleActionResponse>(response);
            }

            Trace.Write("\n\n\nFinished handling action.\n\n\n");
            return Task.FromResult<BaseHandleActionResponse>(new NoOpHandleActionResponse());
        }

        private string readQuickViewJson(string quickViewTemplateFileName)
        {
            string json = null;

            var templatesPath = this.configuration["TemplatesPath"];
            var quickViewTemplatePath = Path.Combine(templatesPath, quickViewTemplateFileName);

            using (StreamReader sr = new StreamReader(quickViewTemplatePath))
            {
                json = sr.ReadToEnd();
            }

            return json;
        }

        private AdaptiveCard createDynamicAdaptiveCard(string cardJson, object dataSource)
        {
            AdaptiveCardTemplate template = new AdaptiveCardTemplate(cardJson);
            var cardJsonWithData = template.Expand(dataSource);

            // Deserialize the JSON string into an AdaptiveCard object
            AdaptiveCardParseResult parseResult = AdaptiveCard.FromJson(cardJsonWithData);

            // Check for errors during parsing
            if (parseResult.Warnings.Count > 0)
            {
                Trace.Write("Warnings during parsing:");
                foreach (var warning in parseResult.Warnings)
                {
                    Trace.Write(warning.Message);
                }
            }

            // Get the AdaptiveCard object
            AdaptiveCard card = parseResult.Card;

            return card;
        }
    }
}
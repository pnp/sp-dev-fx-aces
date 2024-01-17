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

namespace BotPowered_BasicAce_CollectFeedback
{
    public class FeedbackBot : SharePointActivityHandler
    {
        private static string adaptiveCardExtensionId = Guid.NewGuid().ToString();
        private IConfiguration configuration = null;
        public readonly string baseUrl;

        private static ConcurrentDictionary<string, CardViewResponse> cardViews = new ConcurrentDictionary<string, CardViewResponse>();

        private static string CollectFeedbackCardView_ID = "GET_FEEDBACK_CARD_VIEW";
        private static string OkFeedbackCardView_ID = "OK_FEEDBACK_CARD_VIEW";
        private static string FeedbackQuickView_ID = "FEEDBACK_QUICK_VIEW";

        public FeedbackBot(IConfiguration configuration)
            : base()
        {
            this.configuration = configuration;
            this.baseUrl = configuration["BaseUrl"];

            // Add the CardViews
            var aceData = new AceData()
            {
                Title = "Your voice matters!",
                CardSize = AceData.AceCardSize.Large,
                DataVersion = "1.0",
                Id = adaptiveCardExtensionId
            };

            // Collect Feedback Card View (Input Text Card View)
            CardViewResponse feedbackCardViewResponse = new CardViewResponse();
            feedbackCardViewResponse.AceData = aceData;
            feedbackCardViewResponse.CardViewParameters = CardViewParameters.TextInputCardViewParameters(
                new CardBarComponent()
                {
                    Id = "FeedbackCardView",
                },
                new CardTextComponent()
                {
                    Text = "Please, provide feedback"
                },
                new CardTextInputComponent()
                {
                    Id = "feedbackValue",
                    Placeholder = "Your feedback ..."
                },
                new List<CardButtonComponent>()
                {
                    new CardButtonComponent()
                    {
                        Id = "SendFeedback",
                        Title = "Submit",
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>()
                            {
                                {"viewToNavigateTo", OkFeedbackCardView_ID}
                            }
                        }
                    }
                },
                new Microsoft.Bot.Schema.SharePoint.CardImage()
                {
                    Image = $"{baseUrl}/Media/Collect-Feedback.png",
                    AltText = "Collect feedback picture"
                });
            feedbackCardViewResponse.ViewId = CollectFeedbackCardView_ID;

            feedbackCardViewResponse.OnCardSelection = new QuickViewAction()
            {
                Parameters = new QuickViewActionParameters()
                {
                    View = FeedbackQuickView_ID                    
                }
            };

            cardViews.TryAdd(feedbackCardViewResponse.ViewId, feedbackCardViewResponse);

            // OK Feedback Card View (Image Card View)
            CardViewResponse okFeedbackCardViewResponse = new CardViewResponse();
            okFeedbackCardViewResponse.AceData = aceData;
            okFeedbackCardViewResponse.CardViewParameters = CardViewParameters.ImageCardViewParameters(
                new CardBarComponent()
                {
                    Id = "OkFeedbackCardView",
                },
                new CardTextComponent()
                {
                    Text = "Here is your feedback '<feedback>' collected on '<dateTimeFeedback>'"
                },
                new List<BaseCardComponent>()
                {
                    new CardButtonComponent()
                    {
                        Id = "OkButton",
                        Title = "Ok",
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>()
                            {
                                {"viewToNavigateTo", CollectFeedbackCardView_ID}
                            }
                        }
                    }
                },
                new Microsoft.Bot.Schema.SharePoint.CardImage()
                {
                    Image = $"{baseUrl}/Media/Ok-Feedback.png",
                    AltText = "Feedback collected"
                });
            okFeedbackCardViewResponse.ViewId = OkFeedbackCardView_ID;

            okFeedbackCardViewResponse.OnCardSelection = new QuickViewAction()
            {                
                Parameters = new QuickViewActionParameters()
                {
                    View = FeedbackQuickView_ID
                }
            };

            cardViews.TryAdd(okFeedbackCardViewResponse.ViewId, okFeedbackCardViewResponse);
        }

        protected override Task<CardViewResponse> OnSharePointTaskGetCardViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            return Task.FromResult(cardViews[CollectFeedbackCardView_ID]);
        }

        protected override Task<QuickViewResponse> OnSharePointTaskGetQuickViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            // Add the Feedback QuickViews
            QuickViewResponse feedbackQuickViewResponse = new QuickViewResponse();
            feedbackQuickViewResponse.Title = "Your feedback";
            feedbackQuickViewResponse.Template = new AdaptiveCard("1.5");

            AdaptiveContainer container = new AdaptiveContainer();
            container.Separator = true;
            AdaptiveTextBlock titleText = new AdaptiveTextBlock();
            titleText.Text = "Thanks for your feedback!";
            titleText.Color = AdaptiveTextColor.Dark;
            titleText.Weight = AdaptiveTextWeight.Bolder;
            titleText.Size = AdaptiveTextSize.Large;
            titleText.Wrap = true;
            titleText.MaxLines = 1;
            titleText.Spacing = AdaptiveSpacing.None;
            container.Items.Add(titleText);

            AdaptiveTextBlock dateTimeCollectedText = new AdaptiveTextBlock();
            dateTimeCollectedText.Text = $"We truly appreciate your effort in providing valuable feedback to us. Thanks!";
            dateTimeCollectedText.Color = AdaptiveTextColor.Dark;
            dateTimeCollectedText.Size = AdaptiveTextSize.Medium;
            dateTimeCollectedText.Wrap = true;
            dateTimeCollectedText.MaxLines = 3;
            dateTimeCollectedText.Spacing = AdaptiveSpacing.None;
            container.Items.Add(dateTimeCollectedText);

            feedbackQuickViewResponse.Template.Body.Add(container);

            feedbackQuickViewResponse.ViewId = FeedbackQuickView_ID;

            return Task.FromResult(feedbackQuickViewResponse);
        }

        protected override Task<GetPropertyPaneConfigurationResponse> OnSharePointTaskGetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            return base.OnSharePointTaskGetPropertyPaneConfigurationAsync(turnContext, aceRequest, cancellationToken);
        }

        protected override Task<BaseHandleActionResponse> OnSharePointTaskSetPropertyPaneConfigurationAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            return base.OnSharePointTaskSetPropertyPaneConfigurationAsync(turnContext, aceRequest, cancellationToken);
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
                actionParameters["id"].ToString().Equals("SendFeedback", StringComparison.InvariantCultureIgnoreCase))
            {                
                CardViewHandleActionResponse response = new CardViewHandleActionResponse();

                string viewToNavigateTo = actionParameters["data"]["viewToNavigateTo"].ToString();
                var feedbackValue = actionParameters["data"]["feedbackValue"].ToString();
                var dateTimeFeedback = DateTime.Now;

                var nextCard = cardViews[viewToNavigateTo];

                // Configure title and description of task
                var textPattern = "Here is your feedback '<feedback>' collected on '<dateTimeFeedback>'";
                textPattern = textPattern.Replace("<feedback>", feedbackValue).Replace("<dateTimeFeedback>", dateTimeFeedback.ToString());
                ((nextCard.CardViewParameters.Header.ToList())[0] as CardTextComponent).Text = textPattern;

                // Set the response for the action
                response.RenderArguments = nextCard;

                Trace.Write("\n\n\nFinished handling action.\n\n\n");
                return Task.FromResult<BaseHandleActionResponse>(response);
            }
            else if (actionParameters["type"].ToString().Equals("Submit", StringComparison.InvariantCultureIgnoreCase) &&
                actionParameters["id"].ToString().Equals("OkButton", StringComparison.InvariantCultureIgnoreCase))
            {
                CardViewHandleActionResponse response = new CardViewHandleActionResponse();

                string viewToNavigateTo = actionParameters["data"]["viewToNavigateTo"].ToString();

                // Set the response for the action
                response.RenderArguments = cardViews[viewToNavigateTo];

                Trace.Write("\n\n\nFinished handling action.\n\n\n");
                return Task.FromResult<BaseHandleActionResponse>(response);
            }

            Trace.Write("\n\n\nFinished handling action.\n\n\n");
            return Task.FromResult<BaseHandleActionResponse>(new NoOpHandleActionResponse());
        }
    }
}
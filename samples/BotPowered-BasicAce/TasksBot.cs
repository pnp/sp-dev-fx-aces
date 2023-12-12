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

namespace BotPowered_BasicAce
{
    public class TasksBot : SharePointActivityHandler
    {
        public readonly string baseUrl;
        private static ConcurrentDictionary<string, CardViewResponse> cardViews = new ConcurrentDictionary<string, CardViewResponse>();
        private static ConcurrentDictionary<string, QuickViewResponse> quickViews = new ConcurrentDictionary<string, QuickViewResponse>();
        public bool cardViewsCreated = false;
        public bool quickViewsCreate = false;
        public string currentView = "";

        public TasksBot(IConfiguration configuration)
            : base()
        {
            this.baseUrl = configuration["BaseUrl"];

            if (!cardViews.ContainsKey("PRIMARY_TEXT_CARD_VIEW"))
            {
                var aceData = new AceData()
                {
                    Title = "Bot Ace Demo",
                    CardSize = AceData.AceCardSize.Large,
                    DataVersion = "1.0",
                    Id = "c8a3ae0e-f626-469f-add0-6d66b5e1b900"
                };

                Trace.Write("\n\n\nStarting to get card view.\n\n\n");

                // PRIMARY TEXT
                CardViewResponse primaryTextCard = new CardViewResponse();
                primaryTextCard.AceData = aceData;
                primaryTextCard.CardViewParameters = CardViewParameters.PrimaryTextCardViewParameters(
                    new CardBarComponent()
                    {
                        Id = "test"
                    },
                    new CardTextComponent()
                    {
                        Text = "My Bot"
                    },
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new List<BaseCardComponent>()
                    {
                        new CardButtonComponent()
                        {
                            Title = "Basic view",
                            Style = CardButtonStyle.Positive,
                            Action = new SubmitAction()
                            {
                                Parameters = new Dictionary<string, object>()
                                {
                                    {"viewToNavigateTo", "BASIC_CARD_VIEW"}
                                }
                            }
                        },
                        new CardButtonComponent()
                        {
                            Title = "Primary input view",
                            Action = new SubmitAction()
                            {
                                Parameters = new Dictionary<string, object>()
                                {
                                    {"viewToNavigateTo", "PRIMARY_TEXT_CARD_VIEW_INPUT"}
                                }
                            }
                        }
                    });

                primaryTextCard.ViewId = "PRIMARY_TEXT_CARD_VIEW";

                primaryTextCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "PRIMARY_TEXT_QUICK_VIEW"
                    }
                };


                cardViews.TryAdd(primaryTextCard.ViewId, primaryTextCard);

                // PRIMARY TEXT WITH INPUT
                CardViewResponse primaryTextInputCard = new CardViewResponse();
                primaryTextInputCard.AceData = aceData;
                primaryTextInputCard.CardViewParameters = CardViewParameters.PrimaryTextCardViewParameters(
                    new CardBarComponent(),
                    new CardTextComponent()
                    {
                        Text = "My Bot"
                    },
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new List<BaseCardComponent>()
                    {
                        new CardTextInputComponent()
                        {
                            Placeholder = "placeholder",
                            IconBefore = new Microsoft.Bot.Schema.SharePoint.CardImage()
                            {
                                Image = "Send"
                            },
                            Button = new CardTextInputTitleButton()
                            {
                                Title = "Search",
                                Action = new SubmitAction()
                                {
                                    Parameters = new Dictionary<string, object>()
                                    {
                                        {"viewToNavigateTo", "BASIC_CARD_VIEW"}
                                    }
                                }
                            }
                        }
                    });

                primaryTextInputCard.ViewId = "PRIMARY_TEXT_CARD_VIEW_INPUT";

                primaryTextInputCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "PRIMARY_TEXT_QUICK_VIEW"
                    }
                };


                cardViews.TryAdd(primaryTextInputCard.ViewId, primaryTextInputCard);

                // BASIC
                CardViewResponse basicCard = new CardViewResponse();
                basicCard.AceData = aceData;
                basicCard.CardViewParameters = CardViewParameters.BasicCardViewParameters(
                    new CardBarComponent(),
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new List<BaseCardComponent>()
                    {
                        new CardButtonComponent()
                        {
                            Title = "Image view",
                            Action = new SubmitAction()
                            {
                                Parameters = new Dictionary<string, object>()
                                {
                                    {"viewToNavigateTo", "IMAGE_CARD_VIEW"}
                                }
                            }
                        },
                        new CardButtonComponent()
                        {
                            Title = "Get media",
                            Action = new SelectMediaAction()
                            {
                                Parameters = new SelectMediaActionParameters()
                                {
                                    MediaType = SelectMediaActionParameters.MediaTypeOption.Audio
                                }
                            }
                        }
                    });

                basicCard.ViewId = "BASIC_CARD_VIEW";

                basicCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "BASIC_QUICK_VIEW"
                    }
                };
                cardViews.TryAdd(basicCard.ViewId, basicCard);


                // IMAGE
                CardViewResponse imageCard = new CardViewResponse();
                imageCard.AceData = aceData;
                imageCard.CardViewParameters = CardViewParameters.ImageCardViewParameters(
                    new CardBarComponent(),
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new List<BaseCardComponent>()
                    {
                        new CardButtonComponent()
                        {
                            Title = "Input view",
                            Action = new SubmitAction()
                            {
                                Parameters = new Dictionary<string, object>()
                                {
                                    {"viewToNavigateTo", "INPUT_CARD_VIEW"}
                                }
                            }
                        },
                        new CardButtonComponent()
                        {
                            Title = "Show location",
                            Action = new GetLocationAction()
                            {
                                Parameters = new GetLocationActionParameters()
                                {
                                    ChooseLocationOnMap = true
                                }
                            }
                        }
                    },
                    new Microsoft.Bot.Schema.SharePoint.CardImage()
                    {
                        Image = "https://download.logo.wine/logo/SharePoint/SharePoint-Logo.wine.png",
                        AltText = "SharePoint Logo"
                    });
                imageCard.ViewId = "IMAGE_CARD_VIEW";

                imageCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "IMAGE_QUICK_VIEW"
                    }
                };

                cardViews.TryAdd(imageCard.ViewId, imageCard);

                // Input
                CardViewResponse inputCard = new CardViewResponse();
                inputCard.AceData = aceData;
                inputCard.CardViewParameters = CardViewParameters.TextInputCardViewParameters(
                    new CardBarComponent(),
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new CardTextInputComponent()
                    {
                        DefaultValue = "Default"
                    },
                    new List<CardButtonComponent>()
                    {
                        new CardButtonComponent()
                        {
                            Title = "Sign in view",
                            Action = new SubmitAction()
                            {
                                Parameters = new Dictionary<string, object>()
                                {
                                    {"viewToNavigateTo", "SIGN_IN_CARD_VIEW"}
                                }
                            }
                        }
                    },
                    new Microsoft.Bot.Schema.SharePoint.CardImage()
                    {
                        Image = "https://download.logo.wine/logo/SharePoint/SharePoint-Logo.wine.png",
                        AltText = "SharePoint Logo"
                    });
                inputCard.ViewId = "INPUT_CARD_VIEW";

                inputCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "IMAGE_QUICK_VIEW"
                    }
                };

                cardViews.TryAdd(inputCard.ViewId, inputCard);

                // Sign In
                CardViewResponse signInCard = new CardViewResponse();
                signInCard.AceData = aceData;
                dynamic props = new JObject();
                props.uri = "placeholder";
                props.connectionName = "placeholder";
                props.signInButtonText = "Sign in";
                signInCard.AceData.Properties = props;

                signInCard.CardViewParameters = CardViewParameters.SignInCardViewParameters(
                    new CardBarComponent(),
                    new CardTextComponent()
                    {
                        Text = $"Generated on {DateTime.Now}"
                    },
                    new CardTextComponent()
                    {
                        Text = "This is a sign in card template!"
                    },
                    new CardButtonComponent()
                    {
                        Title = "Primary text view",
                        Action = new SubmitAction()
                        {
                            Parameters = new Dictionary<string, object>(){
                                {"viewToNavigateTo", "PRIMARY_TEXT_CARD_VIEW"}
                            }
                        }
                    });

                signInCard.ViewId = "SIGN_IN_CARD_VIEW";

                signInCard.OnCardSelection = new QuickViewAction()
                {
                    Parameters = new QuickViewActionParameters()
                    {
                        View = "SIGN_IN_QUICK_VIEW"
                    }
                };

                cardViews.TryAdd(signInCard.ViewId, signInCard);
                Trace.Write("\n\n\nCard views created!\n\n\n");
            }
        }

        protected override Task<CardViewResponse> OnSharePointTaskGetCardViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            this.currentView = "PRIMARY_TEXT_CARD_VIEW";

            // Access the instanceId of your ACE here
            Trace.Write("\n\n\nHere is your ACE's instanceId! " + turnContext.Activity.Value + "\n\n\n");

            return Task.FromResult(cardViews["PRIMARY_TEXT_CARD_VIEW"]);
        }

        protected override Task<QuickViewResponse> OnSharePointTaskGetQuickViewAsync(ITurnContext<IInvokeActivity> turnContext, AceRequest aceRequest, CancellationToken cancellationToken)
        {
            Trace.Write("\n\n\nStarting to get quick view.\n\n\n");
            QuickViewResponse response = new QuickViewResponse();
            response.Title = "Primary Text quick view";
            response.Template = new AdaptiveCard("1.5");

            AdaptiveContainer container = new AdaptiveContainer();
            container.Separator = true;
            AdaptiveTextBlock titleText = new AdaptiveTextBlock();
            titleText.Text = $"Generated on {DateTime.Now}";
            titleText.Color = AdaptiveTextColor.Dark;
            titleText.Weight = AdaptiveTextWeight.Bolder;
            titleText.Size = AdaptiveTextSize.Large;
            titleText.Wrap = true;
            titleText.MaxLines = 1;
            titleText.Spacing = AdaptiveSpacing.None;
            container.Items.Add(titleText);

            AdaptiveTextBlock descriptionText = new AdaptiveTextBlock();
            descriptionText.Text = "When a Bot powers an Ace it allows you to customize the content of an Ace without deploying a new package, learning about the SPFX toolchain, or having to deploy updates to your customer sites.";
            descriptionText.Color = AdaptiveTextColor.Dark;
            descriptionText.Size = AdaptiveTextSize.Medium;
            descriptionText.Wrap = true;
            descriptionText.MaxLines = 6;
            descriptionText.Spacing = AdaptiveSpacing.None;
            container.Items.Add(descriptionText);

            response.Template.Body.Add(container);

            response.ViewId = "PRIMARY_TEXT_QUICK_VIEW";
            Trace.Write("\n\n\nQuick View created.\n\n\n");
            return Task.FromResult(response);
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
            CardViewResponse primaryTextCardView = cardViews["PRIMARY_TEXT_CARD_VIEW"];

            JObject activityObject = turnContext.Activity.Value as JObject;
            JObject aceProperties = (JObject)activityObject.Property("data").Value;

            foreach (dynamic property in aceProperties)
            {
                switch (property.Key)
                {
                    case "title":
                        primaryTextCardView.AceData.Title = aceProperties[property.Key];
                        break;
                    case "primaryText":
                        ((primaryTextCardView.CardViewParameters.Header.ToList())[0] as CardTextComponent).Text = aceProperties[property.Key];
                        break;
                    case "description":
                        ((primaryTextCardView.CardViewParameters.Body.ToList())[0] as CardTextComponent).Text = aceProperties[property.Key];
                        break;
                    default:
                        break;
                }
            }

            CardViewHandleActionResponse response = new CardViewHandleActionResponse();

            response.RenderArguments = primaryTextCardView;
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

            if (actionParameters["type"].ToString().Equals("Submit"))
            {
                string viewToNavigateTo = actionParameters["data"]["viewToNavigateTo"].ToString();
                CardViewHandleActionResponse response = new CardViewHandleActionResponse();


                response.RenderArguments = cardViews[viewToNavigateTo];

                Trace.Write("\n\n\nFinished handling action.\n\n\n");
                return Task.FromResult<BaseHandleActionResponse>(response);
            }

            Trace.Write("\n\n\nFinished handling action.\n\n\n");
            return Task.FromResult<BaseHandleActionResponse>(new NoOpHandleActionResponse());
        }
    }
}

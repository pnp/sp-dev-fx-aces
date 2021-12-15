import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IMyTeamAdaptiveCardExtensionProps, IMyTeamAdaptiveCardExtensionState } from '../MyTeamAdaptiveCardExtension';
export interface IErrorViewData {
    subTitle: string;
    title: string;
    description: string;
}
export class ErrorView extends BaseAdaptiveCardView<
    IMyTeamAdaptiveCardExtensionProps,
    IMyTeamAdaptiveCardExtensionState, IErrorViewData> {
    public get data(): IErrorViewData {
        return {
            subTitle: "Error Occured while blocking user...",
            title: `User : ${this.state.currentConfig.members[this.state.currentIndex].displayName} `,
            description: "Authorization_RequestDenied : Insufficient privileges to complete the operation.",
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return {
            "schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.2",
            "body": [
                {
                    "type": "TextBlock",
                    "weight": "Bolder",
                    "text": "${title}"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": "${subTitle}",
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "${description}",
                    "wrap": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "id": "close",
                    "title": "Close",
                },
            ]
        };
    }
    public onAction(action: IActionArguments): void {
        if (action.id == "close") {
            this.quickViewNavigator.pop();
        }
    }
}
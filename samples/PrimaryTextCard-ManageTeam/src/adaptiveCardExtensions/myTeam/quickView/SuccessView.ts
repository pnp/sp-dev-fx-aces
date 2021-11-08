import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IMyTeamAdaptiveCardExtensionProps, IMyTeamAdaptiveCardExtensionState } from '../MyTeamAdaptiveCardExtension';
export interface ISuccessViewData {
    subTitle: string;
    title: string;
    description: string;
}
export class SuccessView extends BaseAdaptiveCardView<
    IMyTeamAdaptiveCardExtensionProps,
    IMyTeamAdaptiveCardExtensionState, ISuccessViewData> {
    public get data(): ISuccessViewData {
        return {
            subTitle: `Block Sign-In is successfully done!!`,
            title: `User : ${this.state.currentConfig.members[this.state.currentIndex].displayName} `,
            description: `${this.state.currentConfig.members[this.state.currentIndex].displayName} will not be able to sign in...`,
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
            this.quickViewNavigator.close();
        }
    }
}
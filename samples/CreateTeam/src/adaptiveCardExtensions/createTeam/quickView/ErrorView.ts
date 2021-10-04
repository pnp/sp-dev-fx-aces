import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { ICreateTeamAdaptiveCardExtensionState, ICreateTeamAdaptiveCardExtensionProps } from '../CreateTeamAdaptiveCardExtension';
export interface IErrorViewData {
    subTitle: string;
    title: string;
    description: string;
}
export class ErrorView extends BaseAdaptiveCardView<
ICreateTeamAdaptiveCardExtensionProps,
ICreateTeamAdaptiveCardExtensionState, IErrorViewData> {
    public get data(): IErrorViewData {
        return {
            subTitle: "Error Occured while Creating Team ",
            title: `User :  `,
            description: "Authorization_RequestDenied : Insufficient privileges to complete the operation.",
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/ErrorViewTemplate.json');
    }
    public onAction(action: IActionArguments): void {
        if (action.id == "close") {
            this.quickViewNavigator.pop();
        }
    }
}
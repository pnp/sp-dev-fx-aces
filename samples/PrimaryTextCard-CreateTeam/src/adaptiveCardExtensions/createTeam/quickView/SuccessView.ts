import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { ICreateTeamAdaptiveCardExtensionProps, ICreateTeamAdaptiveCardExtensionState } from '../CreateTeamAdaptiveCardExtension';
export interface ISuccessViewData {
    subTitle: string;
    title: string;
    description: string;
}
export class SuccessView extends BaseAdaptiveCardView<
ICreateTeamAdaptiveCardExtensionProps,
ICreateTeamAdaptiveCardExtensionState, ISuccessViewData> {
    public get data(): ISuccessViewData {
        return {
            subTitle: `Requested Team has been created successfully`,
            title: ``,
            description: ``,
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/SuccessViewTemplate.json');
    }
    public onAction(action: IActionArguments): void {
        if (action.id == "close") {
            this.quickViewNavigator.close();
        }
    }
}
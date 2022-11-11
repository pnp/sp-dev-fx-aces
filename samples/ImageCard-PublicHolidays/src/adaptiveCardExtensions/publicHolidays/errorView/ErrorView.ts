import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';

export interface IErrorViewData {
    subTitle: string;
    title: string;
    description: string;
}

export class ErrorView extends BaseAdaptiveCardView<
    IPublicHolidaysAdaptiveCardExtensionProps,
    IPublicHolidaysAdaptiveCardExtensionState, IErrorViewData> {
    public get data(): IErrorViewData {
        return {
            subTitle: "Error Occured while updating the location ",
            title: `User :  `,
            description: `Error :  `,
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/ErrorViewTemplate.json');
    }
    
    public onAction(action: IActionArguments): void {
        if (action.id === "close") {
            this.quickViewNavigator.pop();
        }
    }
}
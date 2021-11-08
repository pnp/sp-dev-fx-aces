import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IHybridWorkCheckinAdaptiveCardExtensionProps, IHybridWorkCheckinAdaptiveCardExtensionState } from '../HybridWorkCheckinAdaptiveCardExtension';

export interface IQuickViewData {
    subTitle: string;
    title: string;
    description: string;
}

export class CheckinCompleteView extends BaseAdaptiveCardView<
    IHybridWorkCheckinAdaptiveCardExtensionProps,
    IHybridWorkCheckinAdaptiveCardExtensionState,
    IQuickViewData
> {
    public get data(): IQuickViewData {
        return {
            subTitle: "",
            title: "Check-in submitted",
            description: "Your check-in is complete now."
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/QuickViewTemplate.json');
    }

    public onAction(action: IActionArguments | any): void {
        if(action.id=="close"){
            this.quickViewNavigator.close();
        }
    }
}
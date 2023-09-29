import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IPromotePagesAdaptiveCardExtensionProps, IPromotePagesAdaptiveCardExtensionState } from '../PromotePagesAdaptiveCardExtension';
export interface ILoadingViewData {
    title: string;
}
export class LoadingView extends BaseAdaptiveCardView<
IPromotePagesAdaptiveCardExtensionProps,
IPromotePagesAdaptiveCardExtensionState, ILoadingViewData> {
    public get data(): ILoadingViewData {
        return {
            title: `Working on it...`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./templates/LoadingViewTemplate.json');
    }
}
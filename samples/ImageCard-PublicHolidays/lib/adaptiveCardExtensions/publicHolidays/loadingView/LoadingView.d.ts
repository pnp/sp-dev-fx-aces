import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';
export interface ILoadingViewData {
    title: string;
}
export declare class LoadingView extends BaseAdaptiveCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState, ILoadingViewData> {
    get data(): ILoadingViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=LoadingView.d.ts.map
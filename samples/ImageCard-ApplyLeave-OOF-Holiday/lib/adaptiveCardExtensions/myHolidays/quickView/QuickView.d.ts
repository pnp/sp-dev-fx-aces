import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState } from '../MyHolidaysAdaptiveCardExtension';
export interface IQuickViewData {
    myHolidays: any;
}
export declare class QuickView extends BaseAdaptiveCardView<IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';
import { IPublicHoliday } from '../../../models/IPublicHoliday';
import { IAvailableLocation } from "../../../models/IAvailableLocation";
export interface IQuickViewData {
    currentLocation: string;
    upcomingHolidays: IPublicHoliday[];
    availableLocations: IAvailableLocation;
}
export declare class QuickView extends BaseAdaptiveCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    onAction(action: IActionArguments): Promise<void>;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map
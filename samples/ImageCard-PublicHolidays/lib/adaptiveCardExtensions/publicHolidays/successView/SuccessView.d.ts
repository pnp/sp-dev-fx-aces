import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';
export interface ISuccessViewData {
    subTitle: string;
    title: string;
    description: string;
}
export declare class SuccessView extends BaseAdaptiveCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState, ISuccessViewData> {
    get data(): ISuccessViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): void;
}
//# sourceMappingURL=SuccessView.d.ts.map
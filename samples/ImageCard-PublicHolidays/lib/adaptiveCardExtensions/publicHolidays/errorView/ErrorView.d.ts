import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';
export interface IErrorViewData {
    subTitle: string;
    title: string;
    description: string;
}
export declare class ErrorView extends BaseAdaptiveCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState, IErrorViewData> {
    get data(): IErrorViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): void;
}
//# sourceMappingURL=ErrorView.d.ts.map
import { BaseImageCardView, IImageCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export declare class CardView extends BaseImageCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState> {
    /**
    * Buttons will not be visible if card size is 'Medium' with Image Card View.
    * It will support up to two buttons for 'Large' card size.
    */
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IImageCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
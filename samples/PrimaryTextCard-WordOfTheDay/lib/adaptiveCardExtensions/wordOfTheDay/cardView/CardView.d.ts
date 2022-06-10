import { BasePrimaryTextCardView, IPrimaryTextCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState } from '../WordOfTheDayAdaptiveCardExtension';
export declare class CardView extends BasePrimaryTextCardView<IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IPrimaryTextCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
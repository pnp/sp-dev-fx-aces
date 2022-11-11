import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { ITrendingDocumentsAdaptiveCardExtensionProps, ITrendingDocumentsAdaptiveCardExtensionState } from '../TrendingDocumentsAdaptiveCardExtension';
export declare class CardView extends BaseBasicCardView<ITrendingDocumentsAdaptiveCardExtensionProps, ITrendingDocumentsAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
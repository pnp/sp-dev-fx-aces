import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState } from '../DocumentsSharedWithMeAdaptiveCardExtension';
export declare class CardView extends BaseBasicCardView<IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
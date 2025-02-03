import { IExternalLinkCardAction, IQuickViewCardAction, IImageCardParameters, BaseImageCardView, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState } from '../FaqSearchAdaptiveCardExtension';
export declare class CardView extends BaseImageCardView<IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState> {
    get data(): IImageCardParameters;
    private getImageUrl;
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton, ISPFxAdaptiveCard } from '@microsoft/sp-adaptive-card-extension-base';
import { IOneDriveFullImageCarouselAdaptiveCardExtensionProps, IOneDriveFullImageCarouselAdaptiveCardExtensionState } from '../OneDriveFullImageCarouselAdaptiveCardExtension';
export declare class CardView extends BaseBasicCardView<IOneDriveFullImageCarouselAdaptiveCardExtensionProps, IOneDriveFullImageCarouselAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    private getImageUrl;
    get template(): ISPFxAdaptiveCard;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
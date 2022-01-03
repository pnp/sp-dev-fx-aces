import { BasePrimaryTextCardView, IPrimaryTextCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState } from '../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
export declare class CardView extends BasePrimaryTextCardView<IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IPrimaryTextCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
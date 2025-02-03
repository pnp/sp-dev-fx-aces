import { BaseComponentsCardView, ComponentsCardViewParameters, IExternalLinkCardAction, IQuickViewCardAction } from '@microsoft/sp-adaptive-card-extension-base';
import { IReactQuickViewAdaptiveCardExtensionProps, IReactQuickViewAdaptiveCardExtensionState } from '../ReactQuickViewAdaptiveCardExtension';
export declare class CardView extends BaseComponentsCardView<IReactQuickViewAdaptiveCardExtensionProps, IReactQuickViewAdaptiveCardExtensionState, ComponentsCardViewParameters> {
    get cardViewParameters(): ComponentsCardViewParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
import { BasePrimaryTextCardView, IPrimaryTextCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState } from '../DynamicAceAdaptiveCardExtension';
export declare class CardView extends BasePrimaryTextCardView<IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    onAction(action: IActionArguments): void;
    get data(): IPrimaryTextCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map
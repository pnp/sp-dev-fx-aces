import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState } from '../DynamicAceAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
    description: string;
}
export declare class QuickView extends BaseAdaptiveCardView<IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map
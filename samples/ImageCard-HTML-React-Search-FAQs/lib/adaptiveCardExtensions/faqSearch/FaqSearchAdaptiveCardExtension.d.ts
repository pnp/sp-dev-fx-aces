import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IFaqSearchAdaptiveCardExtensionProps {
    title: string;
    heading: string;
    quickViewButton: string;
    imageUrl: string;
    siteUrl: string;
    faqListName: string;
    submitionListName: string;
    faqCollectionData: any[];
    faqFilterLabel: string;
}
export interface IFaqSearchAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class FaqSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=FaqSearchAdaptiveCardExtension.d.ts.map
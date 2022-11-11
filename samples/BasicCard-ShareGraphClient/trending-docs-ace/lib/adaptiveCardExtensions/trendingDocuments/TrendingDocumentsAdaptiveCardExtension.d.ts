import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface ITrendingDocumentsAdaptiveCardExtensionProps {
    title: string;
}
export interface ITrendingDocumentsAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class TrendingDocumentsAdaptiveCardExtension extends BaseAdaptiveCardExtension<ITrendingDocumentsAdaptiveCardExtensionProps, ITrendingDocumentsAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=TrendingDocumentsAdaptiveCardExtension.d.ts.map
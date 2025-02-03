import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IReactQuickViewAdaptiveCardExtensionProps {
    title: string;
    listName: string;
}
export interface IReactQuickViewAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class ReactQuickViewAdaptiveCardExtension extends BaseAdaptiveCardExtension<IReactQuickViewAdaptiveCardExtensionProps, IReactQuickViewAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=ReactQuickViewAdaptiveCardExtension.d.ts.map
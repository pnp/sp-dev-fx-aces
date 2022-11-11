import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IDocumentsSharedWithMeAdaptiveCardExtensionProps {
    title: string;
}
export interface IDocumentsSharedWithMeAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class DocumentsSharedWithMeAdaptiveCardExtension extends BaseAdaptiveCardExtension<IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=DocumentsSharedWithMeAdaptiveCardExtension.d.ts.map
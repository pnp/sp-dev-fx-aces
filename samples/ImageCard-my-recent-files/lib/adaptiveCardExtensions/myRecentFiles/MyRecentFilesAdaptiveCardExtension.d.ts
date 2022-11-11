import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { IFiles } from '../../models';
export interface IMyRecentFilesAdaptiveCardExtensionProps {
    title: string;
    iconProperty: string;
}
export interface IMyRecentFilesAdaptiveCardExtensionState {
    files: IFiles[];
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class MyRecentFilesAdaptiveCardExtension extends BaseAdaptiveCardExtension<IMyRecentFilesAdaptiveCardExtensionProps, IMyRecentFilesAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private _services;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=MyRecentFilesAdaptiveCardExtension.d.ts.map
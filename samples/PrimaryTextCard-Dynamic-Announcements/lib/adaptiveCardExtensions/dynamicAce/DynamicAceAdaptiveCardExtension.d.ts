import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import ISPListitem from '../dynamicAce/models/IListItem';
export interface IDynamicAceAdaptiveCardExtensionProps {
    title: string;
    listName: string;
    iconProperty: string;
    autoRotate: boolean;
}
export interface IDynamicAceAdaptiveCardExtensionState {
    items: ISPListitem[];
    currentIndex: any;
    currentitem: ISPListitem;
    clickedview: boolean;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class DynamicAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private _spService;
    private listItems;
    onInit(): Promise<void>;
    get title(): string;
    protected get iconProperty(): string;
    private btnListSchemaCreation;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=DynamicAceAdaptiveCardExtension.d.ts.map
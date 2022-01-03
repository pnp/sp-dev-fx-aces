import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseAdaptiveCardExtension } from "@microsoft/sp-adaptive-card-extension-base";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { Socket } from "socket.io-client";
import { IListNotifications } from "../../models/IListNotifications";
export interface IAceMyNotificationsAdaptiveCardExtensionProps {
    title: string;
    description: string;
    iconProperty: string;
    context: BaseComponentContext;
    selectedList: any;
    selectedSite: IPropertyFieldSite[];
}
export interface IAceMyNotificationsAdaptiveCardExtensionState {
    subTitle?: string;
    listNotifications: IListNotifications[];
    socketIoId: Socket;
    fromCard: number;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class AceMyNotificationsAdaptiveCardExtension extends BaseAdaptiveCardExtension<IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    get title(): string;
    protected get iconProperty(): string;
    protected get selectedList(): any;
    protected get selectedSite(): IPropertyFieldSite[];
    private subscribeListNotifications;
    protected onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected get disableReactivePropertyChanges(): boolean;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    handleNotifications(data: string): Promise<void>;
    private getActionDescription;
    private addActivityToList;
}
//# sourceMappingURL=AceMyNotificationsAdaptiveCardExtension.d.ts.map
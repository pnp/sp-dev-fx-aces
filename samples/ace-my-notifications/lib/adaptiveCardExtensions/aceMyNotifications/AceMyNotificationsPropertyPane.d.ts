import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { IAceMyNotificationsAdaptiveCardExtensionProps } from "./AceMyNotificationsAdaptiveCardExtension";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
export declare class AceMyNotificationsPropertyPane {
    private _groupsfields;
    private context;
    private onPropertyPaneFieldChanged;
    private properties;
    constructor(context: AdaptiveCardExtensionContext, properties: IAceMyNotificationsAdaptiveCardExtensionProps, onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>);
    private _getGroupFields;
    getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=AceMyNotificationsPropertyPane.d.ts.map
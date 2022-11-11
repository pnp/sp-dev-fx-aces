import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHoliday } from '../../models/IPublicHoliday';
import { IAvailableLocation } from "../../models/IAvailableLocation";
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
export interface IPublicHolidaysAdaptiveCardExtensionProps {
    title: string;
    listTitle: string;
    userProfileProperty: string;
    limitToDate: IDateTimeFieldValue;
}
export interface IPublicHolidaysAdaptiveCardExtensionState {
    userProfileProperty: string;
    availableLocations: IAvailableLocation;
    officeLocation: string;
    isLocationUpdated: boolean;
    areHolidaysLoaded: boolean;
    limitToDate: IDateTimeFieldValue;
    listGUID: string;
    listURL: string;
    upcomingHolidays: IPublicHoliday[];
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export declare const LOADING_VIEW_REGISTRY_ID: string;
export declare const SUCCESS_VIEW_REGISTRY_ID: string;
export declare const ERROR_VIEW_REGISTRY_ID: string;
export default class PublicHolidaysAdaptiveCardExtension extends BaseAdaptiveCardExtension<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    private _loadCardInfo;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void>;
}
//# sourceMappingURL=PublicHolidaysAdaptiveCardExtension.d.ts.map
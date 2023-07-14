import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IMyHolidaysAdaptiveCardExtensionProps {
    title: string;
    dropdownProperty: string;
}
export interface IMyHolidaysAdaptiveCardExtensionState {
    myHolidays: any;
    upcomingHoliday: any;
    currentIndex: number;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export declare const DETAILED_QUICK_VIEW_REGISTRY_ID: string;
export default class MyHolidaysAdaptiveCardExtension extends BaseAdaptiveCardExtension<IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected get iconProperty(): string;
}
//# sourceMappingURL=MyHolidaysAdaptiveCardExtension.d.ts.map
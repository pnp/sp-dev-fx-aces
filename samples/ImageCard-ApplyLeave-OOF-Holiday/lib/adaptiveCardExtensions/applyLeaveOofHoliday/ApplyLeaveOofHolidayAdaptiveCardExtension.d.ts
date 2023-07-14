import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphService } from '../../services/GraphService';
export interface IApplyLeaveOofHolidayAdaptiveCardExtensionProps {
    title: string;
    graphService: GraphService;
}
export interface ILeaveObject {
    startDate: Date;
    endDate: Date;
    leaveType: string;
    leaveDescription: string;
    oofMessage?: string;
    isOOfEnabled?: boolean;
    attachment?: any;
}
export interface IApplyLeaveOofHolidayAdaptiveCardExtensionState {
    leaveInfo: ILeaveObject;
    startDateIsGreater: boolean;
    errOnSubmit: boolean;
    appliedLeaves: ILeaveObject;
    myHoliday: any;
    nearestHoliday: any;
    isHCardEnabled: boolean;
    leaveHistory: ILeaveObject[];
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export declare const LEAVE_VIEW_REGISTRY_ID: string;
export declare const HOLIDAY_CONFIG_VIEW_REGISTRY_ID: string;
export declare const LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID: string;
export declare const SUCCESS_VIEW_REGISTRY_ID: string;
export default class ApplyLeaveOofHolidayAdaptiveCardExtension extends BaseAdaptiveCardExtension<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected get iconProperty(): string;
    private getMyLeaves;
}
//# sourceMappingURL=ApplyLeaveOofHolidayAdaptiveCardExtension.d.ts.map
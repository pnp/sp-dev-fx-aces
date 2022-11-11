import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
export interface IOneDriveFullImageCarouselAdaptiveCardExtensionProps {
    selectedDriveId: string;
    timerMinutes: number;
    randomizeImage: boolean;
    fullBleed: boolean;
}
export interface IOneDriveFullImageCarouselAdaptiveCardExtensionState {
    rootDriveId: string;
    drivesResults: IPropertyPaneDropdownOption[];
    itemIndex: number;
    targetFolder: MicrosoftGraph.DriveItem;
    error: object;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class OneDriveFullImageCarouselAdaptiveCardExtension extends BaseAdaptiveCardExtension<IOneDriveFullImageCarouselAdaptiveCardExtensionProps, IOneDriveFullImageCarouselAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private updateImageTimer;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    private loadDrives;
    private loadTargetDriveItems;
    private updateImageIndex;
    private randomIndex;
    private setError;
}
//# sourceMappingURL=OneDriveFullImageCarouselAdaptiveCardExtension.d.ts.map
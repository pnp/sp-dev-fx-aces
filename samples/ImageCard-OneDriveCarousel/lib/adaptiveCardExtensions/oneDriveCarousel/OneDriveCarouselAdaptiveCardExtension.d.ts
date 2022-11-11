import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
export interface IOneDriveCarouselAdaptiveCardExtensionProps {
    title: string;
    description: string;
    iconProperty: string;
    selectedDriveId: string;
    timerSeconds: number;
    randomizeImage: boolean;
    hideButtons: boolean;
}
export interface IOneDriveCarouselAdaptiveCardExtensionState {
    description: string;
    rootDriveId: string;
    drivesResults: IPropertyPaneDropdownOption[];
    itemIndex: number;
    targetFolder: MicrosoftGraph.DriveItem;
    error: object;
    isLoading: boolean;
    folderHasImages: boolean;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class OneDriveCarouselAdaptiveCardExtension extends BaseAdaptiveCardExtension<IOneDriveCarouselAdaptiveCardExtensionProps, IOneDriveCarouselAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private updateImageTimer;
    private graphClient;
    onInit(): Promise<void>;
    get title(): string;
    protected get iconProperty(): string;
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
//# sourceMappingURL=OneDriveCarouselAdaptiveCardExtension.d.ts.map
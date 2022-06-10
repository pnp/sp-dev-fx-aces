import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IOneDriveCarouselAdaptiveCardExtensionProps, IOneDriveCarouselAdaptiveCardExtensionState } from '../OneDriveCarouselAdaptiveCardExtension';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
export interface IQuickViewData {
    detailsLabel: string;
    fileNameLabel: string;
    sizeLabel: string;
    modifiedLabel: string;
    currentItem: MicrosoftGraph.DriveItem;
    hasImage: boolean;
    hasDateTime: boolean;
}
export declare class QuickView extends BaseAdaptiveCardView<IOneDriveCarouselAdaptiveCardExtensionProps, IOneDriveCarouselAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState } from '../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle?: string;
    title: string;
    listNotifications: any;
}
export declare class QuickView extends BaseAdaptiveCardView<IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    onAction: (action: IActionArguments | any) => void;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView copy.d.ts.map
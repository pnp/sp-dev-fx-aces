import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IPromotePagesAdaptiveCardExtensionProps, IPromotePagesAdaptiveCardExtensionState } from '../PromotePagesAdaptiveCardExtension';
export interface IErrorViewData {
    title: string;
}
export class ErrorView extends BaseAdaptiveCardView<
IPromotePagesAdaptiveCardExtensionProps,
IPromotePagesAdaptiveCardExtensionState, IErrorViewData> {
    public get data(): IErrorViewData {
        return {
            title: `Error !`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./templates/ErrorViewTemplate.json');
    }
}
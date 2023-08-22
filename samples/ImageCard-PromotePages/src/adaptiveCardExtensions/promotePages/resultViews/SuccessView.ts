import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IPromotePagesAdaptiveCardExtensionProps, IPromotePagesAdaptiveCardExtensionState } from '../PromotePagesAdaptiveCardExtension';
export interface ISuccessViewData {
    title: string;
}
export class SuccessView extends BaseAdaptiveCardView<
IPromotePagesAdaptiveCardExtensionProps,
IPromotePagesAdaptiveCardExtensionState, ISuccessViewData> {
    public get data(): ISuccessViewData {
        return {
            title: `Success !`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./templates/SucessViewPromoteTemplate.json');
    }
}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ICreateTeamAdaptiveCardExtensionProps, ICreateTeamAdaptiveCardExtensionState } from '../CreateTeamAdaptiveCardExtension';
export interface ILoadingViewData {
    title: string;
}
export class LoadingView extends BaseAdaptiveCardView<
ICreateTeamAdaptiveCardExtensionProps,
ICreateTeamAdaptiveCardExtensionState, ILoadingViewData> {
    public get data(): ILoadingViewData {
        return {
            title: `Request is in progress....`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./template/LoadingViewTemplate.json');
    }
}
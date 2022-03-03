import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState } from '../NewTeamsAdaptiveCardExtension';
export interface ILoadingViewData {
    title: string;
}
export class LoadingView extends BaseAdaptiveCardView<
INewTeamsAdaptiveCardExtensionProps,
INewTeamsAdaptiveCardExtensionState, ILoadingViewData> {
    public get data(): ILoadingViewData {
        return {
            title: `Working on it...`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./templates/LoadingViewTemplate.json');
    }
}
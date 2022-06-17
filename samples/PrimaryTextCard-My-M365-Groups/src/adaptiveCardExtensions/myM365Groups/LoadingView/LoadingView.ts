import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState, GROUPS_LISTING_VIEW_REGISTRY_ID } from '../MyM365GroupsAdaptiveCardExtension';

export interface ILoadingViewData {
    loadingImage: string;
    title: string;
}

export class LoadingView extends BaseAdaptiveCardView<
    IMyM365GroupsAdaptiveCardExtensionProps,
    IMyM365GroupsAdaptiveCardExtensionState, ILoadingViewData> {
    private loadingImage: string = require('../assets/loading.gif');

    public get data(): ILoadingViewData {
        return {
            loadingImage: this.loadingImage,
            title: strings.LoadingGroupsText,
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/LoadingViewTemplate.json');
    }
}
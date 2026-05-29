import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState } from '../NewTeamsAdaptiveCardExtension';
import SuccessViewTemplate from './templates/SuccessViewTemplate.json';
export interface ISuccessViewData {
    title: string;
}
export class SuccessView extends BaseAdaptiveCardView<
INewTeamsAdaptiveCardExtensionProps,
INewTeamsAdaptiveCardExtensionState, ISuccessViewData> {
    public get data(): ISuccessViewData {
        return {
            title: `Success !`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return SuccessViewTemplate;
    }
}
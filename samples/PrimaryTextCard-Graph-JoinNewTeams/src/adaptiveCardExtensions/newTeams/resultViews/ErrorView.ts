import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState } from '../NewTeamsAdaptiveCardExtension';
export interface IErrorViewData {
    title: string;
}
export class ErrorView extends BaseAdaptiveCardView<
INewTeamsAdaptiveCardExtensionProps,
INewTeamsAdaptiveCardExtensionState, IErrorViewData> {
    public get data(): IErrorViewData {
        return {
            title: `Error !`,
        };
    }
    public get template(): ISPFxAdaptiveCard {
        return require('./templates/ErrorViewTemplate.json');
    }
}
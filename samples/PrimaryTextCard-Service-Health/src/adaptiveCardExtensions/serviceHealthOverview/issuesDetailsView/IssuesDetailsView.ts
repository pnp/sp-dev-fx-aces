import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ServiceHealthOverviewAdaptiveCardExtensionStrings';
import { IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState } from '../ServiceHealthOverviewAdaptiveCardExtension';
import * as _ from "lodash";
import { Issue } from '../../types';

export interface IIssueDetailsViewData {
    issues: Issue[];
}

export class IssuesDetailsView extends BaseAdaptiveCardView<
    IServiceHealthOverviewAdaptiveCardExtensionProps,
    IServiceHealthOverviewAdaptiveCardExtensionState,
    IIssueDetailsViewData
> {
    public get data(): IIssueDetailsViewData {

        let { selectedService, services } = this.state;

        if (selectedService === null || services === null) {
            return {
                issues: [{
                    title: "Invalid card selection",
                    url: "https://admin.microsoft.com/#/servicehealth"
                }]
            };
        }

        return {
            issues: services.find(s => s.name === selectedService).issues
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/IssuesDetailsViewTemplate.json');
    }

    public get title(): string {
        return this.state.selectedService;
    }
}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ServiceHealthOverviewAdaptiveCardExtensionStrings';
import { IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState, ISSUES_DETAILS_VIEW_REGISTRY_ID } from '../ServiceHealthOverviewAdaptiveCardExtension';
import * as _ from "lodash";
import { Service } from '../../types';
import IssuesViewTemplate from './template/IssuesViewTemplate.json';

export interface IIssueViewData {
  services: Service[];
}

export class IssuesView extends BaseAdaptiveCardView<
  IServiceHealthOverviewAdaptiveCardExtensionProps,
  IServiceHealthOverviewAdaptiveCardExtensionState,
  IIssueViewData
> {
  public get data(): IIssueViewData {

    let { services } = this.state;

    return {
      services
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return IssuesViewTemplate as ISPFxAdaptiveCard;
  }

  public get title(): string {
    return "Affected services";
  }

  public onAction(action: IActionArguments): void {

    this.quickViewNavigator.push(ISSUES_DETAILS_VIEW_REGISTRY_ID, true);
    this.setState({
      selectedService: (<ISubmitActionArguments>action).data.service
    });
  }
}
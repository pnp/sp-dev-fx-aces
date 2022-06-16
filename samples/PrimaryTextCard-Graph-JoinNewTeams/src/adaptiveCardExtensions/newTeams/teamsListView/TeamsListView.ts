import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'NewTeamsAdaptiveCardExtensionStrings';
import { INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState, JOIN_VIEW_REGISTRY_ID } from '../NewTeamsAdaptiveCardExtension';
import * as _ from "lodash";
import { Team } from '../../types';

export interface ITeamsListViewData {
  teams: Team[];
}

export class TeamsListView extends BaseAdaptiveCardView<
INewTeamsAdaptiveCardExtensionProps,
INewTeamsAdaptiveCardExtensionState,
  ITeamsListViewData
> {
  public get data(): ITeamsListViewData {

    let { teams } = this.state;

    if(teams.length == 0){
      this.quickViewNavigator.close();
    }

    return {
      teams
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/TeamsListViewTemplate.json');
  }

  public get title(): string {
    return "New Teams";
  }

  public onAction(action: IActionArguments): void {

    this.quickViewNavigator.push(JOIN_VIEW_REGISTRY_ID, true);
    this.setState({
      selectedTeam: (<ISubmitActionArguments>action).data.team
    });
  }
}
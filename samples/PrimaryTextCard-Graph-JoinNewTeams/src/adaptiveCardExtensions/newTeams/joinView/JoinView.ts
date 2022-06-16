import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'NewTeamsAdaptiveCardExtensionStrings';
import { ERROR_VIEW_REGISTRY_ID, INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState, LOADING_VIEW_REGISTRY_ID, SUCCESS_VIEW_REGISTRY_ID } from '../NewTeamsAdaptiveCardExtension';
import {GraphServiceInstance} from '../../GraphService';
import * as _ from "lodash";
import { RetrievedTeams, Team } from '../../types';
import { format } from 'date-fns';

export interface IJoinViewData {
  team: Team;
}

export class JoinView extends BaseAdaptiveCardView<
INewTeamsAdaptiveCardExtensionProps,
INewTeamsAdaptiveCardExtensionState,
  IJoinViewData
> {
  public get data(): IJoinViewData {

    let { teams, selectedTeam } = this.state;

    return {
      team :teams.find(s => s.displayName === selectedTeam)
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/JoinViewTemplate.json');
  }

  public get title(): string {
    return "New Teams";
  }

  public onAction(action: IActionArguments |any): void {
    try{
      const currentTeams = this.state.retrievedTeams;
      let updatedRetrievedTeams:RetrievedTeams= {
        "@odata.count": 0,
        "value": [],
        userId: this.state.retrievedTeams.userId
    };
    let updatedTeams: Team[] = [];
      if (action.id == "Submit") {
        this.quickViewNavigator.replace(LOADING_VIEW_REGISTRY_ID);
        setTimeout(async() => {
          const dataRetriedved = await GraphServiceInstance.AddTeamMember(action.data.id,this.state.retrievedTeams.userId);
        }, 0);
        currentTeams.value.forEach(element => {
          if(element.id != action.data.id){
            updatedRetrievedTeams.value.push(element);
            updatedTeams.push({
              displayName: element.displayName,
              createdDateTime: format(new Date(element.createdDateTime), 'yyyy-MM-dd'),
              description: element.description,
              picture: element.picture,
              id: element.id
            });
          }
        });
        updatedRetrievedTeams['@odata.count'] = updatedRetrievedTeams.value.length;
        this.setState({ 
          retrievedTeams: updatedRetrievedTeams,
          teams: updatedTeams
        });
        setTimeout(() => {this.quickViewNavigator.replace(SUCCESS_VIEW_REGISTRY_ID);}, 2000);
      }
    }catch (error){
      this.quickViewNavigator.replace(ERROR_VIEW_REGISTRY_ID);
      console.warn("An error occured", error);
    }
  }
}
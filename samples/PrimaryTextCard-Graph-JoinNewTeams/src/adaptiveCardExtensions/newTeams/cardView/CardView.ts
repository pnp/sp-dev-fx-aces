import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'NewTeamsAdaptiveCardExtensionStrings';
import { INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState, TEAMS_LIST_VIEW_REGISTRY_ID } from '../NewTeamsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<INewTeamsAdaptiveCardExtensionProps, INewTeamsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if(this.state.retrievedTeams != null){
      if(this.state.retrievedTeams['@odata.count'] > 0){
        return [
          {
            title: strings.QuickViewButton,
            style: 'positive',
            action: {
              type: 'QuickView',
              parameters: {
                view: TEAMS_LIST_VIEW_REGISTRY_ID
              }
            }
          }
        ];
      }else{
        return undefined;
      }
    }else{
      return undefined;
    }

  }

  public get data(): IPrimaryTextCardParameters {

    if (this.state.retrievedTeams === null) {
      return {
        primaryText: "Loading...",
        description: "",
        title: this.properties.title,
        iconProperty: "Timer"
      };
    }

    let { retrievedTeams } = this.state;

    const numberOfTeams: number = retrievedTeams['@odata.count'];

    return {
      primaryText: numberOfTeams > 1 ? `${numberOfTeams} new Teams` : numberOfTeams == 0 ? "No new team." : "1 new team",
      description: numberOfTeams > 1 ? `${numberOfTeams} new Teams were created recently !` : numberOfTeams == 0 ? "No team was created recently !" : "1 new team was created recently !",
      title: "New Teams",
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://teams.microsoft.com/'
      }
    };
  }
}

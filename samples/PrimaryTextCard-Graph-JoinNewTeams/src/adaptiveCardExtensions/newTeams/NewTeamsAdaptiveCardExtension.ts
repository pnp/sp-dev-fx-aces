import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { TeamsListView } from './teamsListView/TeamsListView';
import { JoinView } from './joinView/JoinView';
import { NewTeamsPropertyPane } from './NewTeamsPropertyPane';
import { RetrievedTeams, Team } from '../types';
import { getRecentlyCreatedTeams } from '../TeamsData';
import {GraphServiceInstance} from '../GraphService';
import * as _ from 'lodash';
import { LoadingView } from './resultViews/LoadingView';
import { SuccessView } from './resultViews/SuccessView';
import { ErrorView } from './resultViews/ErrorView';
import { format } from 'date-fns';

export interface INewTeamsAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
}

export interface INewTeamsAdaptiveCardExtensionState {
  teams: Team[];
  selectedTeam: string;
  retrievedTeams: RetrievedTeams;
  cardViewToRender: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'NewTeams_CARD_VIEW';
export const TEAMS_LIST_VIEW_REGISTRY_ID: string = 'NewTeams_TEAMS_LIST_VIEW';
export const JOIN_VIEW_REGISTRY_ID: string = 'NewTeams_JOIN_VIEW';
export const LOADING_VIEW_REGISTRY_ID: string = 'NewTeams_LOADING_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID: string = 'NewTeams_SUCCESS_VIEW';
export const ERROR_VIEW_REGISTRY_ID: string = 'NewTeams_ERROR_VIEW';

export default class NewTeamsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  INewTeamsAdaptiveCardExtensionProps,
  INewTeamsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: NewTeamsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      teams: null,
      retrievedTeams: null,
      selectedTeam: "",
      cardViewToRender: CARD_VIEW_REGISTRY_ID
    };

    GraphServiceInstance.context = this.context;

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(TEAMS_LIST_VIEW_REGISTRY_ID, () => new TeamsListView());
    this.quickViewNavigator.register(JOIN_VIEW_REGISTRY_ID, () => new JoinView());
    this.quickViewNavigator.register(LOADING_VIEW_REGISTRY_ID, () => new LoadingView());
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, () => new SuccessView());
    this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, () => new ErrorView());

    await this.loadTeams();
    return Promise.resolve();
  }

  private async loadTeams(): Promise<void> {

    setTimeout(async () => {
      let retrievedTeams: RetrievedTeams = await getRecentlyCreatedTeams(this.context.pageContext.user.loginName);
      const teams: Team[] =
        _(retrievedTeams.value)
        .map(i => ({
          displayName: i.displayName,
          createdDateTime: format(new Date(i.createdDateTime), 'yyyy-MM-dd'),
          description: i.description,
          picture: i.picture,
          id: i.id
        }))
          .value();

          console.debug("Teams retrieved", teams);

      this.setState({
        retrievedTeams,
        teams
      });
      
    }, 300);
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/TeamsLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'NewTeams-property-pane'*/
      './NewTeamsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.NewTeamsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}

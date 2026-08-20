import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IFootballStatsAdaptiveCardExtensionProps, IFootballStatsAdaptiveCardExtensionState, STANDINGS_VIEW_REGISTRY_ID} from '../FootballStatsAdaptiveCardExtension';
import { ApiService } from '../services/ApiService';

export interface IQuickViewData {
  leagues: any;
}

export class QuickView extends BaseAdaptiveCardView<
  IFootballStatsAdaptiveCardExtensionProps,
  IFootballStatsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const leagues = require("../services/Leagues.json");
    return {
      leagues: leagues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction = async (action: IActionArguments): Promise<void> => {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'Standings') {
          const response = await ApiService.getStandingsByLeague(this.state.context, action.data.league);
          if(response.length === 0)
          {
            //this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
            this.setState({
              standingsData: []
            });
          }
          else
          {
            this.quickViewNavigator.push(STANDINGS_VIEW_REGISTRY_ID);
            this.setState({
              standingsData: response.standings[0].table,
              standingCurrentIndex: 0
            });
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}
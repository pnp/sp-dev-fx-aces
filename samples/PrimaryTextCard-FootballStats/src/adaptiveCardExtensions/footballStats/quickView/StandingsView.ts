import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FootballStatsAdaptiveCardExtensionStrings';
import { IFootballStatsAdaptiveCardExtensionProps, IFootballStatsAdaptiveCardExtensionState } from '../FootballStatsAdaptiveCardExtension';

export interface IStandingsViewData {
  teamDetails: any;
}

export class StandingsView extends BaseAdaptiveCardView<
  IFootballStatsAdaptiveCardExtensionProps,
  IFootballStatsAdaptiveCardExtensionState,
  IStandingsViewData
> {

  public get data(): IStandingsViewData {
    return {
      teamDetails: this.state.standingsData[this.state.standingCurrentIndex]
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/StandingsViewTemplate.json');
  }

  public onAction = async (action: IActionArguments) => {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        let idx = this.state.standingsData[this.state.standingCurrentIndex].position - 1;
        let newViewId: number = this.state.standingCurrentIndex;
        if (id === 'Previous') {
          idx--;
          if (idx < 0) {
            newViewId = this.state.standingsData[this.state.standingsData.length - 1].position - 1;
          }
          else {
            newViewId = this.state.standingsData[idx].position - 1;
          }
        }
        else if (id === 'Next') {
          idx++;
          if (idx < this.state.standingsData.length) {
            newViewId = this.state.standingsData[idx].position - 1;
          }
          else {
            newViewId = this.state.standingsData[0].position - 1;
          }
        }
        this.setState({
          standingCurrentIndex: newViewId
        });
      }
    }
    catch (err) {
      console.log(err);
    }
  }

}
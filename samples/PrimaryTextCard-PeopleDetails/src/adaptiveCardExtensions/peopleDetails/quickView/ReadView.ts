import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { DIALOGUE_VIEW_REGISTRY_ID, IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, MESSAGE_VIEW_REGISTRY_ID, UPDATE_VIEW_REGISTRY_ID } from '../PeopleDetailsAdaptiveCardExtension';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PnPServices } from '../../../Services/PnPServices';

export interface IReadViewData {
  people?: any;
}

export class ReadView extends BaseAdaptiveCardView<
  IPeopleDetailsAdaptiveCardExtensionProps,
  IPeopleDetailsAdaptiveCardExtensionState,
  IReadViewData
> {
  public refreshData: any;
  public get data(): IReadViewData {
    let people = this.state.peopleData[this.state.currentIndex];
    PnPServices.refreshData().then((refreshData) => {
      this.refreshData = refreshData;
    }).catch((err) => {
      console.log(err);
    });
    return {
      people: people
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ReadViewTemplate.json');
  }

  public onAction = async (action: IActionArguments) => {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        let idx = this.state.peopleData[this.state.currentIndex].id;
        let newViewId: number = this.state.currentIndex;
        if (id === 'Update') {
          this.quickViewNavigator.push(UPDATE_VIEW_REGISTRY_ID, true);
        }
        else if (id === 'Delete') {

        }
        if (id === 'Previous') {
          idx--;
          if (idx < 0) {
            newViewId = this.state.peopleData[this.state.peopleData.length - 1].id;
          }
          else {
            newViewId = this.state.peopleData[idx].id;
          }
        }
        else if (id === 'Next') {
          idx++;
          if (idx < this.state.peopleData.length) {
            newViewId = this.state.peopleData[idx].id;
          }
          else {
            newViewId = this.state.peopleData[0].id;
          }
        }
        else if (id === 'Delete') {
          this.quickViewNavigator.push(DIALOGUE_VIEW_REGISTRY_ID, true);
        }
        this.setState({
          peopleData: this.refreshData["peopleData"],
          countryData: this.refreshData["countryData"],
          currentIndex: newViewId
        });
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}
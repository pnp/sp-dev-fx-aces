import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, MESSAGE_VIEW_REGISTRY_ID } from '../PeopleDetailsAdaptiveCardExtension';
import { PnPServices } from '../../../Services/PnPServices';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IUpdateViewData {
  people: any;
  country: any;
  messageBar: any;
  emailValidator: string;
}

export class UpdateView extends BaseAdaptiveCardView<
  IPeopleDetailsAdaptiveCardExtensionProps,
  IPeopleDetailsAdaptiveCardExtensionState,
  IUpdateViewData
> {

  public get data(): IUpdateViewData {
    let people = this.state.peopleData[this.state.currentIndex];
    let country = this.state.countryData;
    let messageBar = this.state.messageBar;
    return {
      people: people,
      country: country,
      messageBar: messageBar,
      emailValidator: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z0-9-]{2,4}$"
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/UpdateViewTemplate.json');
  }

  public onAction = async (action: IActionArguments) => {
    try {
      if (action.type === 'Submit') {
        if (action.data.id === "Update") {
          let updateStatus = await PnPServices.updateItem(action.data, this.state.peopleData[this.state.currentIndex].itemId);
          if (updateStatus) {
            let refreshData: any = await PnPServices.refreshData();
            this.quickViewNavigator.replace(MESSAGE_VIEW_REGISTRY_ID, true);
            this.setState({
              peopleData: refreshData["peopleData"],
              countryData: refreshData["countryData"],
              messageBar: {
                text: "Item updated successfully",
                success: true,
                iconUrl: this.state.imgPath + "checkmark_circle_24_filled.svg",
                color: "Green"
              }
            });
          }
          else {
            this.quickViewNavigator.push(MESSAGE_VIEW_REGISTRY_ID, true);
            this.setState({
              messageBar: {
                text: "Error occured while updating item",
                success: false,
                iconUrl: this.state.imgPath + "error_circle_24_filled.svg",
                color: "Red"
              }
            });
          }
        }
        if (action.data.id === 'Cancel') {
          this.quickViewNavigator.close();
        }
      }
    }
    catch (err) {
      console.log(err);
      this.quickViewNavigator.push(MESSAGE_VIEW_REGISTRY_ID, true);
      this.setState({
        messageBar: {
          text: "Error occured while updating item",
          success: false,
          iconUrl: this.state.imgPath + "error_circle_24_filled.svg",
          color: "Red"
        }
      });
    }
  }
}
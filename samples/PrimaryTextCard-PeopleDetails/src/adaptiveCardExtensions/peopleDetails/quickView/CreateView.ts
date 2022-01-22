import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, MESSAGE_VIEW_REGISTRY_ID } from '../PeopleDetailsAdaptiveCardExtension';
import { PnPServices } from '../../../Services/PnPServices';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface ICreateViewData {
  messageBar: any;
  country: any[];
  emailValidator: string;
}

export class CreateView extends BaseAdaptiveCardView<
  IPeopleDetailsAdaptiveCardExtensionProps,
  IPeopleDetailsAdaptiveCardExtensionState,
  ICreateViewData
> {
  public get data(): ICreateViewData {
    let messageBar = this.state.messageBar;
    let country = this.state.countryData;
    return {
      messageBar: messageBar,
      country: country,
      emailValidator: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z0-9-]{2,4}$"
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/CreateViewTemplate.json');
  }

  public onAction = async (action: IActionArguments) => {
    try {
      if (action.type === 'Submit') {
        let newItem: any;
        if (action.data.id === 'Create') {
          newItem = await PnPServices.createItem(action.data);
          if (newItem != null) {
            let refreshData: any = await PnPServices.refreshData();
            let newCurrentIndex = refreshData["peopleData"].filter(item => item["itemId"] === newItem["data"]["ID"]);
            this.quickViewNavigator.push(MESSAGE_VIEW_REGISTRY_ID, true);
            this.setState({
              peopleData: refreshData["peopleData"],
              countryData: refreshData["countryData"],
              currentIndex: newCurrentIndex[0]["id"],
              messageBar: {
                text: "Item added successfully",
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
                text: "Error occured while adding item",
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
          text: "Error occured while adding item",
          success: false,
          iconUrl: this.state.imgPath + "error_circle_24_filled.svg",
          color: "Red"
        }
      });
    }
  }
}
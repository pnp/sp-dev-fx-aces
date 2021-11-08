import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyTeamAdaptiveCardExtensionStrings';
import { IMyTeam } from '../../../models/models';
import { IMyTeamAdaptiveCardExtensionProps, IMyTeamAdaptiveCardExtensionState,ERROR_VIEW_REGISTRY_ID,SUCCESS_VIEW_REGISTRY_ID} from '../MyTeamAdaptiveCardExtension';
export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  item: IMyTeam;
}

export class QuickView extends BaseAdaptiveCardView<
  IMyTeamAdaptiveCardExtensionProps,
  IMyTeamAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description,
      item: this.state.currentConfig.members[this.state.currentIndex]
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return {
      "type": "AdaptiveCard",
      "version": "1.2",
      "body": [
        {
          "type": "Container",
          "$data": "${item}",
          "items": [
            {
              "type": "TextBlock",
              "weight": "Bolder",
              "text": "Display Name: ${displayName}",
              "color": "attention"
            },
            {
              "type": "Container",
              "spacing": "Small",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "Surname: ${surname}",
                  "spacing": "Small"
                },
                {
                  "type": "TextBlock",
                  "text": "Given Name: ${givenName}",
                  "spacing": "Small"
                },
                {
                  "type": "TextBlock",
                  "text": "Mail: ${mail}",
                  "spacing": "Small",
                  "color": "good",
                }
              ]
            }
          ],
          "separator": true
        }
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "id": "close",
          "title": "Close",
        },
        {
          "type": "Action.Submit",
          "id": "Block",
          "title": "Block Sign-In",
        },
        {
          "type": "Action.Submit",
          "id": "Error",
          "title": "Generate Error",
        }
      ],
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
    };
    //return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id == "close") {
      this.quickViewNavigator.close();
    }
    if (action.id == "Block") {
      setTimeout(async () => {
        await this.state.service.BlockSignIn(this.state.currentConfig.members[this.state.currentIndex].userPrincipalName)
          .then((res) => {
            if(res==false){
              // Push Error card to quick view navigator
              this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
            }
            else{
              this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID);
            }
          }).catch((error) => {
            alert("Something went wrong");
          });
      }, 0);
    }
    if(action.id == 'Error'){
      this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
    }
  }
}
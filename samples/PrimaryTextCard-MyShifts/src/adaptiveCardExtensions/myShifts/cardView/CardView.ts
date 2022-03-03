import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as moment from 'moment';
import * as strings from 'MyShiftsAdaptiveCardExtensionStrings';
import { IMyShiftsAdaptiveCardExtensionProps, IMyShiftsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID,CONFIGURETEAMVIEW_REGISTRY_ID } from '../MyShiftsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IMyShiftsAdaptiveCardExtensionProps, IMyShiftsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {

    if(this.state.shifts.length == 0 )
    {
      return [
        {
          title: strings.ConfigureTeam,
          action: {
            type: 'QuickView',
            parameters: {
              view: CONFIGURETEAMVIEW_REGISTRY_ID
            }
          }
        }
      ];
    }
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: strings.ConfigureTeam,
        action: {
          type: 'QuickView',
          parameters: {
            view: CONFIGURETEAMVIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    if(this.state.error)
    {
      if(this.state.error.statusCode == 404){
      return {
        primaryText: "Shifts not found",
        description: "Shifts app is not configured for this teams, please choose another one"
      };
      }
    }
    if(this.state.shifts.length >0 ) {
      if(this.properties.showShiftDateAsTitle) {
      return {
        primaryText:  moment(this.state.shifts[0].sharedShift.startDateTime).format("dddd, MMM D"),
        description:  moment(this.state.shifts[0].sharedShift.startDateTime).format("h:mm A") + " - " +  moment(this.state.shifts[0].sharedShift.endDateTime).format("h:mm A")
      };
    }
    else{
      return {
        primaryText:  this.state.shifts[0].sharedShift.displayName,
        description:  moment(this.state.shifts[0].sharedShift.startDateTime).format("ddd, Do, h:mm A") + " - " +  moment(this.state.shifts[0].sharedShift.endDateTime).format("h:mm A")
      };
    }
      }
      else{
        if(this.state.shiftTitle != "") {
          return {
            primaryText: this.state.shiftTitle,
            description: this.state.shiftDescription
          };
        }
        else{
            return {
              primaryText: "Loading",
              description: "Loading"
            };
        }
      }
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    //redirect user to here
    //msteams:/l/entity/42f6c1da-a241-483a-a3cc-4f5be9185951/shifts?context=%7B%22subEntityId%22%3A%22%257B%2522groupId%2522%253A%25225de400c3-b6d6-4f71-bf8b-ba4125015910%2522%252C%2522view%2522%253A%2522schedules%2522%252C%2522source%2522%253A%2522companydashboard%2522%252C%2522shiftId%2522%253A%2522SHFT_0fbbe4f0-aa96-4d05-b15d-74338bef6fd8%2522%252C%2522startDateTime%2522%253A%25222022-02-03T02%253A30%253A00.000Z%2522%252C%2522endDateTime%2522%253A%25222022-02-03T11%253A30%253A00.000Z%2522%257D%22%7D
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}

import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState> {
   /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
   public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [     
      {
        title: "Apply Leave",
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    debugger
    let _primaryText="Apply leave & set out of office";

    if(this.state.appliedLeaves != undefined){
       _primaryText= `You have applied leave from ${this.state.appliedLeaves.startDate} to ${this.state.appliedLeaves.endDate}`;
    }
    
    return {
      primaryText: _primaryText,
      imageUrl: require('../assets/LeaveCal.jpg'),
      title: this.properties.title
    };
  }


  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if(this.state.leaveHistory.length === 1 && isEmpty(this.state.leaveHistory[0].leaveType)){
      {
        return {
          type: 'ExternalLink',
          parameters: {
            target:"https://google.com"
          }
        };
      }
    }
    else
    {
      return {
        type: 'QuickView',
        parameters: {
          view: LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID
        }
      };
    }
   
  }
  
}

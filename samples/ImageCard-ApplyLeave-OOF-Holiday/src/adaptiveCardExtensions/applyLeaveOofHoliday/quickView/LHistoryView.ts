import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { HOLIDAY_CONFIG_VIEW_REGISTRY_ID, IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILeaveObject } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';


export interface ILHistoryViewData { 
  leaveHistory:ILeaveObject[];
}

export class LHistoryView extends BaseAdaptiveCardView<
IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
IApplyLeaveOofHolidayAdaptiveCardExtensionState,
  ILHistoryViewData
> {
  public get data(): ILHistoryViewData {    
    return {
      leaveHistory:this.state.leaveHistory,     
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/LeaveHistoryViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    try
    {
      if(action.type == "Submit"){       
       this.quickViewNavigator.push(HOLIDAY_CONFIG_VIEW_REGISTRY_ID,false);
       
      }
      
    }
    catch(err){
      console.log("Exception occurred");
    }
    
  }
  
}
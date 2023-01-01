import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import moment from 'moment';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, LEAVE_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';

export interface IQuickViewData {
  isDateTrue?:boolean;
}

export class QuickView extends BaseAdaptiveCardView<
IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
IApplyLeaveOofHolidayAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return { 
      isDateTrue:this.state.startDateIsGreater
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    try
    {
      if(action.type == "Submit"){
        const { startDate, endDate,leaveTypeId,leaveDescId,setOOFId } = action.data;
        var isafter = moment(startDate).isAfter(endDate);
        //validation for check a date
        if(!isafter){
          this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID, true);
          this.setState({
            leaveInfo:{endDate,startDate,leaveType:leaveTypeId,leaveDescription:leaveDescId,isOOfEnabled:setOOFId === "1"?true:false,oofMessage:null}
          });
        }
        else
        {
          
          this.setState({
            startDateIsGreater:isafter
          });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID,false);
        }
       
      }
      
    }
    catch(err){
      console.log("Exception occurred");
    }
    
  }
  
}
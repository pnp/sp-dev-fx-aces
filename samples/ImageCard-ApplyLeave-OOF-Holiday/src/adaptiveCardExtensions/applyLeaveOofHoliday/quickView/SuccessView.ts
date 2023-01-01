import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';

import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILeaveObject } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';


export interface ISuccessViewData { 
  leaveHistory:ILeaveObject[];
}

export class SuccessView extends BaseAdaptiveCardView<
IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
IApplyLeaveOofHolidayAdaptiveCardExtensionState,
ISuccessViewData
> {
  public get data(): ISuccessViewData {    
    return {
      leaveHistory:this.state.leaveHistory,     
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SuccessViewTemplate.json');
  }

 
  
}
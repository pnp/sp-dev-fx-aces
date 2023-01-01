import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments} from '@microsoft/sp-adaptive-card-extension-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';

import { Constants } from '../../../services/Constants';
import commonAction from '../../../services/CommonService';
import { sp } from '@pnp/sp/presets/all';


export interface IHolidayConfigViewData {
  isEnabled:any;
}

export class HolidayConfigView extends BaseAdaptiveCardView<
IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
IApplyLeaveOofHolidayAdaptiveCardExtensionState,
IHolidayConfigViewData
> {
    


  public get data(): IHolidayConfigViewData {   
    return {
     isEnabled:this.state.isHCardEnabled?"true":"false"
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/HolidayConfigViewTemplate.json');    
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === 'Submit') {
        const { enableCardId } = action.data;

        const configItem= await commonAction.getConfigList(this.context.pageContext.user.email);
        if(configItem.length>0){
           await sp.web.lists.getByTitle(Constants.CONFIG_LIST_NAME).items.getById(configItem[0].Id).update({
            Value:enableCardId
          }).then((updatedRes:any)=>{
              !isEmpty(updatedRes.data)? window.location.reload():null;
          });
        
        }
    }
  }
 
}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments} from '@microsoft/sp-adaptive-card-extension-base';
import { sp } from '@pnp/sp/presets/all';
import commonAction from '../../../services/CommonService';
import {  GraphService } from '../../../services/GraphService';
import { isEmpty } from '@microsoft/sp-lodash-subset';

import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, SUCCESS_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';

export interface ILeaveViewData {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  leaveDesc: string;
  isOOFEnabled:boolean;
  oofMessage:string; 
  uploadIcon:string;
  errOnSubmit?:boolean;
}

export class LeaveView extends BaseAdaptiveCardView<
IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
IApplyLeaveOofHolidayAdaptiveCardExtensionState,
  ILeaveViewData
> {
    
  public _graphService:GraphService;

  public get data(): ILeaveViewData {   
    return {
      endDate:this.state.leaveInfo.endDate,
      startDate:this.state.leaveInfo.startDate,
      isOOFEnabled:this.state.leaveInfo.isOOfEnabled,
      leaveType:this.state.leaveInfo.leaveType,
      leaveDesc:this.state.leaveInfo.leaveDescription,
      oofMessage:this.state.leaveInfo.oofMessage,
      uploadIcon:require("../assets/uploadIcon.png"),
      errOnSubmit:this.state.errOnSubmit
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/LeaveViewTemplate.json');
  }

  public async onAction(action: IActionArguments){  

    try{
      debugger
      this._graphService=new GraphService(this.context);
      if(action.type == "Submit"){      
        const { startDate, endDate,isOOfEnabled}=this.state.leaveInfo;       
        let authorInfo=await sp.web.currentUser.get();          
        if(!isOOfEnabled){    
          debugger    
          commonAction.addItemToList(this.state.leaveInfo,authorInfo)
          .then((res)=>{
            this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID,false)
            //!isEmpty(res)? window.location.reload():null;
            });
        }
        else
      {
        commonAction.addItemToList(this.state.leaveInfo,authorInfo)
        .then((res)=>{          
          debugger
            if(action.data.oofMessage !==undefined && !isEmpty(res)){
              this._graphService.SetOutOfOffice(startDate,endDate,action.data.oofMessage)
              .then((oofResponse)=>{
                debugger
                console.log(oofResponse)
                   this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID,false);
                    if(oofResponse) return window.location.reload();
                    this.setState({
                        errOnSubmit:true
                    });
                    //this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID,false);
              });
            }
          else
          {
            const OOF_MESSAGE="Out of office";
            this._graphService.SetOutOfOffice(startDate,endDate,OOF_MESSAGE)
            .then((oofResponse)=>{
              if(oofResponse) return window.location.reload();
              // this.setState({
              //     errOnSubmit:true
              // });
              // this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID,false);
            });
          }           

        });
    }
    }

    }
    catch(err){
      console.log("Exception :",err);
    }
    
  }
}
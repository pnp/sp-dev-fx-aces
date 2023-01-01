import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { ApplyLeaveOofHolidayPropertyPane } from './ApplyLeaveOofHolidayPropertyPane';
import { GraphService } from '../../services/GraphService';
import commonAction from '../../services/CommonService';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { Constants } from '../../services/Constants';

export interface IApplyLeaveOofHolidayAdaptiveCardExtensionProps {
  title: string;
  graphService:GraphService;
}

export interface ILeaveObject{
  startDate:Date;
  endDate:Date;
  leaveType:string;
  leaveDescription:string;
  oofMessage?:string;
  isOOfEnabled?:boolean;
  attachment?:any;
}

export interface IApplyLeaveOofHolidayAdaptiveCardExtensionState {
  leaveInfo:ILeaveObject;
  startDateIsGreater:boolean;
  errOnSubmit:boolean;
  appliedLeaves:ILeaveObject;
  myHoliday:any;
  nearestHoliday:any;
  isHCardEnabled:boolean;
  leaveHistory:ILeaveObject[];
}

const CARD_VIEW_REGISTRY_ID: string = 'ApplyLeave_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ApplyLeave_QUICK_VIEW';
export const LEAVE_VIEW_REGISTRY_ID: string = 'ApplyLeave_LEAVE_VIEW';
export const HOLIDAY_CONFIG_VIEW_REGISTRY_ID: string = 'ApplyLeave_HolidayConfig_VIEW';
export const LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID: string = 'Leave_History_Config_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID: string = 'Success_QUICK_VIEW';

export default class ApplyLeaveOofHolidayAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IApplyLeaveOofHolidayAdaptiveCardExtensionProps,
  IApplyLeaveOofHolidayAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ApplyLeaveOofHolidayPropertyPane | undefined;

  public onInit(): Promise<void> {
    let aceContext:any=this.context;     
     sp.setup({
      spfxContext:aceContext
    });

   
    this.state = {
      leaveInfo:{endDate:null,isOOfEnabled:true,leaveDescription:null,leaveType:null,oofMessage:"out of office",startDate:null,attachment:null},
      startDateIsGreater:false,
      errOnSubmit:false,
      appliedLeaves:null,
      myHoliday:null,
      nearestHoliday:null,
      isHCardEnabled:false,
      leaveHistory:[{endDate:null,isOOfEnabled:true,leaveDescription:null,leaveType:null,oofMessage:"out of office",startDate:null,attachment:null}],
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());   
     this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID,() => import( './quickView/QuickView')
       .then((component) => new component.QuickView())
     );
     this.quickViewNavigator.register(LEAVE_VIEW_REGISTRY_ID,() => import( './quickView/LeaveView')
     .then((component) => new component.LeaveView())
    );   
   this.quickViewNavigator.register(HOLIDAY_CONFIG_VIEW_REGISTRY_ID,() => import( './quickView/HolidayConfigView')
   .then((component) => new component.HolidayConfigView())
    );   
    this.quickViewNavigator.register(LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID,() => import( './quickView/LHistoryView')
   .then((component) => new component.LHistoryView())
    );  
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID,() => import( './quickView/SuccessView')
   .then((component) => new component.SuccessView())
    );  

const today = new Date();

   return new  Promise(async (resolve,reject)=>{
    try
    {       
      debugger
      //get applied leaves
        const userAppliedLeaves=await this.getMyLeaves();
       
        let appliedLeaves:any=[];
        let leaveHistory:any=[];
      
        //recent applied leaves
        userAppliedLeaves.filter((ele:any)=>{
            if(new Date(ele.StartDate)>today){
              appliedLeaves.push(ele);
            }
            else
            {
              leaveHistory.push(ele);
            }
        });         
        
       
        const configItem= await commonAction.getConfigList(this.context.pageContext.user.email);
        var isTrueSet = (configItem[0].Value !== undefined &&  configItem[0].Value !== null && configItem[0].Value != '' && configItem[0].Value === 'true');   
      
        appliedLeaves=!isEmpty(appliedLeaves)?{startDate:appliedLeaves[0].StartDate,endDate:appliedLeaves[0].EndDate,leaveDescription:appliedLeaves[0].LeaveDescription,leaveType:appliedLeaves[0].LeaveType}:null;
             
          this.setState({
            appliedLeaves,
            isHCardEnabled:isTrueSet,
            leaveHistory
          });      
      
      

      
        resolve(null);
    }
    catch(err){
      resolve(null);
    }
     
   
  });

  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ApplyLeaveOofHoliday-property-pane'*/
      './ApplyLeaveOofHolidayPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ApplyLeaveOofHolidayPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected get iconProperty(): string {
    return require("./assets/oofIcon.png");
  }

  private getMyLeaves=async()=>{
   
    try
    {
      const userLeaves=await sp.web.lists.getByTitle(Constants.LEAVETRACKER_LIST_NAME).items 
      .orderBy("Created",true)
      .select("StartDate","EndDate","LeaveType","LeaveDescription","AppliedBy/Title","AppliedBy/ID","AppliedBy/EMail","Created","Status")
      .expand("AppliedBy")
      .filter(`AppliedBy/EMail eq '${this.context.pageContext.user.email}'`)
      //.filter(`AppliedBy/EMail eq '${this.context.pageContext.user.email}' and StartDate ge '${today.toISOString()}'`)    
      .get();
  
      return userLeaves;
    }
    catch(err){
      console.log(err);
      return null;
    }
    
  }
  
}

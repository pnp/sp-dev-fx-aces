import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyHolidaysPropertyPane } from './MyHolidaysPropertyPane';
import { sp } from '@pnp/sp/presets/all';
import commonAction from '../../services/CommonService';
import { isEmpty } from '@microsoft/sp-lodash-subset';

export interface IMyHolidaysAdaptiveCardExtensionProps {
  title: string;
  dropdownProperty:string;
}

export interface IMyHolidaysAdaptiveCardExtensionState {
  myHolidays:any;
  upcomingHoliday:any;
  currentIndex:number;
}

const CARD_VIEW_REGISTRY_ID: string = 'MyHolidays_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyHolidays_QUICK_VIEW';
export const DETAILED_QUICK_VIEW_REGISTRY_ID: string = 'MyHolidays_DETAILED_VIEW';

export default class MyHolidaysAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyHolidaysAdaptiveCardExtensionProps,
  IMyHolidaysAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyHolidaysPropertyPane | undefined;

  public async onInit(): Promise<void> {

    let aceContext:any=this.context;     
    sp.setup({
     spfxContext:aceContext
   });
   
   this.state = {
    myHolidays:null,
    upcomingHoliday:null,
    currentIndex:0
   };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    const countryCode=!isEmpty(this.properties.dropdownProperty)?this.properties.dropdownProperty:'in';
  
    let myLeaveCalendar= await commonAction.getHolidayList(this.context,countryCode); 
    let myHolidays:any;
    let upcomingHoliday:any;

    if(!isEmpty(myLeaveCalendar) && myLeaveCalendar.holidayCalArr != undefined && myLeaveCalendar.nextHoliday != undefined){
      myHolidays=myLeaveCalendar.holidayCalArr;
      myHolidays=myHolidays.map((ele:any)=>({...ele,img:require("./assets/Holi.png")}));
      upcomingHoliday=myLeaveCalendar.nextHoliday;
    }
    else
    {
      myHolidays=null;
      upcomingHoliday=null;
    }

    const configItem= await commonAction.getConfigList(this.context.pageContext.user.email);    
    let isTrueSet=false;
    if(configItem != null && configItem.length >0){
      isTrueSet = configItem[0].Value === 'true';   
    }    
    this.isVisible= (isTrueSet !== undefined && isTrueSet !== null )?isTrueSet:false;

    this.setState({
      myHolidays,
      upcomingHoliday
    });


    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyHolidays-property-pane'*/
      './MyHolidaysPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyHolidaysPropertyPane();
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
    return require("./assets/holidayIcon.png")
  }
}

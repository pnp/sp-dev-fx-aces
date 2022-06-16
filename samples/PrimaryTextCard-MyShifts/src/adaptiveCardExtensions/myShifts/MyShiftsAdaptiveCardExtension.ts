import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ConfigureTeamView } from './quickView/ConfigureTeamView';
import { MyShiftsPropertyPane } from './MyShiftsPropertyPane';
import { MSGraphClient,HttpClient,HttpClientResponse } from '@microsoft/sp-http';
import { SubmitMessage } from './quickView/SubmitMessage';

export interface IMyShiftsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  referesh:any;
  showShiftDateAsTitle:boolean;
}

export interface IMyShiftsAdaptiveCardExtensionState {
  description: string;
  settings:any;
  shifts:any;
  myteams:[];
  selectedTeamId:string;
  currentuser:any;
  error:any;
  shiftTitle:string;
  shiftDescription:string;
  
}

export const CARD_VIEW_REGISTRY_ID: string = 'MyShifts_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyShifts_QUICK_VIEW';
export const CONFIGURETEAMVIEW_REGISTRY_ID: string = 'MyShifts_Configure_View';
export const SUBMITMESSAGE_REGISTRY_ID: string = 'MyShifts_SubmitMessage';


export default class MyShiftsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyShiftsAdaptiveCardExtensionProps,
  IMyShiftsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyShiftsPropertyPane | undefined;

  private graphClient;
  public onInit(): Promise<void> {
    this.state = {
      description: this.properties.description,
      settings:{},
      shifts:[],
      myteams:[],
      selectedTeamId:"",
      currentuser:{},
      error:null,
      shiftDescription:"",
      shiftTitle:""
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(CONFIGURETEAMVIEW_REGISTRY_ID, () => new ConfigureTeamView());
    this.quickViewNavigator.register(SUBMITMESSAGE_REGISTRY_ID, () => new SubmitMessage());
   
    this.intialize();
    this.properties.referesh = this.refreshCard;
 
    return Promise.resolve();
  }

  private async intialize()
  {
    this.graphClient = await  this.context.msGraphClientFactory.getClient();
    this.getTeamsIds();
  }

  private async refreshCard()
  {
  
  }

  
  private async getTeamsIds(){

    var loggedinuser = await this.graphClient.api("/me").get();
      this.setState({currentuser:loggedinuser});

    var teamsdata = await this.graphClient.api("/me/joinedTeams").get();
    this.setState({myteams:teamsdata.value});

   this.graphClient.api('/me/drive/special/approot:/shiftsviasettings.json?select=@microsoft.graph.downloadUrl')
  .header('content-type', 'text/plain')
  .get(async (error, settings: any) => {
      if(error)
      {
        this.setState({shiftTitle:"Card not configured",shiftDescription:"Select Configure Team button to select Team"});
      }
      else{
        console.log(settings);
          const response:any = await this.context.httpClient.get(settings['@microsoft.graph.downloadUrl'], HttpClient.configurations.v1);
        //   if (!response.ok) {
        //     const errorDetails = await response.json();
        //     console.error(errorDetails);
        //     console.error("unable to get settings file from one drive");
        //     return null;
        // }
          if(response.ok)
          {
            var settingsdata = await response.text();
            console.log(settingsdata);
            this.setState({settings:JSON.parse(settingsdata),selectedTeamId:JSON.parse(settingsdata).shiftsTeamsIDs});
            this.getShifts();  
          }
          else{
            this.setState({shiftTitle:"Card not configured",shiftDescription:"Select Configure Team button to select Team"});
          }
      }
    }
  );
  
  
  //   this.graphClient
  // .api('https://graph.microsoft.com/v1.0/me/drive/special/approot:/settings.json?select=@microsoft.graph.downloadUrl')
  // .get()
  // .then((response: { '@microsoft.graph.downloadUrl': string }): Promise<HttpClientResponse> => {
  //   return this.httpClient
  //     .get(response['@microsoft.graph.downloadUrl'], HttpClient.configurations.v1);
  // })
  // .then((response: HttpClientResponse): Promise<string> => {
  //   if (response.ok) {
  //     return response.text();
  //   }

  //   return Promise.reject(response.statusText);
  // })
  // .then((settingsString: string): Promise<ISettings> => {
  //   try {
  //     const settings: ISettings = JSON.parse(settingsString);
  //     return Promise.resolve(settings);
  //   }
  //   catch (e) {
  //     return Promise.resolve(defaultSettings);
  //   }
  // }, _ => Promise.resolve(defaultSettings));

  }

  public async getShifts(){
    
      var startDateTime = new Date(Date.now()).toISOString();
      
      
      await this.graphClient.api("/teams/" + this.state.settings.shiftsTeamsIDs + "/schedule/shifts?$filter=sharedShift/startDateTime ge " + startDateTime).get(async (error, response: any) => {
          if(response){
          console.log(response.value);
          var filteredShift = response.value.filter(el => el.userId == this.state.currentuser.id);
          if(filteredShift.length == 0 ){
              this.setState({shiftTitle:"No upcoming shifts",shiftDescription:"Enjoy your family time"});
          }
          this.setState({shifts:filteredShift,error:null});
        }
        if(error){
          this.setState({error:error});
        }
     
    });
   
  }



  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyShifts-property-pane'*/
      './MyShiftsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyShiftsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}

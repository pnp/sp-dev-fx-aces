import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyShiftsAdaptiveCardExtensionStrings';
import { IMyShiftsAdaptiveCardExtensionProps, IMyShiftsAdaptiveCardExtensionState,SUBMITMESSAGE_REGISTRY_ID } from '../MyShiftsAdaptiveCardExtension';
import { MSGraphClient} from '@microsoft/sp-http';
export interface IConfigureTeamViewData {
  myteams: [];
  selectedTeamid:string;
}

export class ConfigureTeamView extends BaseAdaptiveCardView<
  IMyShiftsAdaptiveCardExtensionProps,
  IMyShiftsAdaptiveCardExtensionState,
  IConfigureTeamViewData
> {
  public get data(): IConfigureTeamViewData {
    return {
      myteams: this.state.myteams,
      selectedTeamid:this.state.selectedTeamId
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ConfigureTeamViewTemplate.json');
  }

  public async onAction(action: any): Promise<void> {
    try {
      if (action.type === 'Submit') {
       
        const { id } = action.data;
        if (id === 'save') {
         console.log(action.data.teamID);
         
         this.storeTeamsID(action.data.teamID);
         //todo SHOW HERE SUCESS MESSAGE VIEW
        }
        
        }
      
    } catch (err) {
      
    }
}

private async storeTeamsID(teamid){
    const settings = { shiftsTeamsIDs: teamid};
    var graphClient = await this.context.msGraphClientFactory.getClient();
    
    graphClient.api('/me/drive/special/approot:/shiftsviasettings.json:/content')
    .header('content-type', 'text/plain')
    .put(JSON.stringify(settings));
            this.setState({settings:settings,selectedTeamId:settings.shiftsTeamsIDs});
            // this.quickViewNavigator.pop();
            // this.cardNavigator.replace(CARD_VIEW_REGISTRY_ID);
            var startDateTime = new Date(Date.now()).toISOString();
            
            await graphClient.api("/teams/" + this.state.settings.shiftsTeamsIDs + "/schedule/shifts?$filter=sharedShift/startDateTime ge " + startDateTime).get(async (error, response: any) => {
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
              this.quickViewNavigator.replace(SUBMITMESSAGE_REGISTRY_ID);
          });
  }
  

}
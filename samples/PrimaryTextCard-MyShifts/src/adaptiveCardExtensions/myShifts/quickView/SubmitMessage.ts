import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyShiftsAdaptiveCardExtensionStrings';
import { IMyShiftsAdaptiveCardExtensionProps, IMyShiftsAdaptiveCardExtensionState,CARD_VIEW_REGISTRY_ID } from '../MyShiftsAdaptiveCardExtension';
import { MSGraphClient} from '@microsoft/sp-http';
export interface IConfigureTeamViewData {
  myteams: [];
  selectedTeamid:string;
}

export class SubmitMessage extends BaseAdaptiveCardView<
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
    return require('./template/SubmitMessage.json');
  }

  public async onAction(action: any): Promise<void> {
    try {
      if (action.type === 'Submit') {
       
        const { id } = action.data;
        if (id === 'ok') {
         console.log(action.data.teamID)
          this.quickViewNavigator.close();
        } 
        
        }
      
    } catch (err) {
      
    }
}

}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CreateTeamAdaptiveCardExtensionStrings';
import { ICreateTeamAdaptiveCardExtensionProps, ICreateTeamAdaptiveCardExtensionState,
  ERROR_VIEW_REGISTRY_ID,
  SUCCESS_VIEW_REGISTRY_ID,LOADING_VIEW_REGISTRY_ID } from '../CreateTeamAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { ITeamProperties } from '../../../Models/ITeamProperties';
export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ICreateTeamAdaptiveCardExtensionProps,
  ICreateTeamAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments | any): void {
    try {
      if (action.id == "Submit") {
        this.quickViewNavigator.push(LOADING_VIEW_REGISTRY_ID);
        Logger.write(`Submit button clicked`, LogLevel.Info); 
        let TeamProperties : ITeamProperties = {
          description:action.data.description,
          displayName:action.data.displayName,
          type:action.data.type,
          templateType:action.data.templateType
        }
        setTimeout(async() => {
          await this.state.service.CreateTeam(TeamProperties).then((res)=>{
            if(res == false){
              this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
            }
            else{
              this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID);
            }
            
          }).catch((err)=>{
            this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
          });
        }, 0);
      }
    } catch (error) {
      this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
      Logger.write(`QuickView (onAction) - ${error} - `, LogLevel.Error);
    }
  }

}
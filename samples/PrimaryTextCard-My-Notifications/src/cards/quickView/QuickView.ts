import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceMyNotificationsAdaptiveCardExtensionStrings';
import { pullAt } from "lodash";
import { IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState } from '../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
import { listNotificationsCard } from "../../templates";
import { QUICK_VIEW_REGISTRY_ID  } from './../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
export interface IQuickViewData {
  subTitle?: string;
  title: string;
  listNotifications;
}
export class QuickView extends BaseAdaptiveCardView<
  IAceMyNotificationsAdaptiveCardExtensionProps,
  IAceMyNotificationsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
       title: this.properties.title,
       listNotifications: this.state.listNotifications
    };
  }

  public onAction = (action: IActionArguments | any) : void => {
    if (action.id === "ClearAll"){

         this.setState({listNotifications: []});
    }
    if (action.id === "Remove"){
          const {listNotifications} = this.state;
          const r = pullAt(listNotifications,[action.data.index]);
         this.setState({listNotifications: listNotifications});
    }
  }

  public get template():ISPFxAdaptiveCard   {
    return  listNotificationsCard  ;
    //return require('./template/QuickViewTemplate.json');
  }

}

import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceMyNotificationsAdaptiveCardExtensionStrings';
import { isArray } from "lodash";
import { IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IAceMyNotificationsAdaptiveCardExtensionProps, IAceMyNotificationsAdaptiveCardExtensionState> {
    public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {

    const numberNotification = this.state.listNotifications.length ?? 0 ;
    let messageCard = "No Notification(s)";
    if (numberNotification){
      messageCard = `${numberNotification} Notifications`;
    }else{
      messageCard = "No Notifications";
    }
    return {
      primaryText: messageCard ,
      description:   this.properties.selectedList?.title ?? '',
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}

import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState } from '../PeopleDetailsAdaptiveCardExtension';
import { PnPServices } from '../../../Services/PnPServices';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IMessageViewData {
  messageBar: any;
}

export class MessageView extends BaseAdaptiveCardView<
  IPeopleDetailsAdaptiveCardExtensionProps,
  IPeopleDetailsAdaptiveCardExtensionState,
  IMessageViewData
> {
  public get data(): IMessageViewData {
    let messageBar = this.state.messageBar;
    return {
      messageBar: messageBar,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/MessageViewTemplate.json');
  }

}
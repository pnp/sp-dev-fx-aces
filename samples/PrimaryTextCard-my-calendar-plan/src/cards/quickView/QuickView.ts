import { Event } from '@microsoft/microsoft-graph-types';
import {
  BaseAdaptiveCardView,
  ISPFxAdaptiveCard,
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState,
} from '../../adaptiveCardExtensions/myDay/MyDayAdaptiveCardExtension';

export interface IQuickViewDataEvent extends Event {
  startTime?: string;
}

export interface IQuickViewData {
  title: string;
  userDisplayName: string;
  events: IQuickViewDataEvent[];
  date: string;
  time: string;
  numberItems: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState,
  IQuickViewData
> {

  public get data(): IQuickViewData {
    return {
      title:this.state.title,
      userDisplayName:this.state.userDisplayName,
      events:this.state.events.map(e => (
        {...e, startTime: new Date(e.start.dateTime + 'Z').toLocaleTimeString().split(':').length > 2 ? 
                            new Date(e.start.dateTime + 'Z').toLocaleTimeString().split(':').slice(0, 2).join(':') :
                            new Date(e.start.dateTime + 'Z').toLocaleTimeString() //If locale time contains seconds remove seconds
        })),
      date: this.state.date,
      time: new Date().toTimeString().split(':').length > 2 ? 
              new Date().toTimeString().split(':').slice(0, 2).join(':') :
              new Date().toTimeString(),
      numberItems:this.state.numberItems
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./../../templates/MyDay/MyDayCard.json');
  }
}

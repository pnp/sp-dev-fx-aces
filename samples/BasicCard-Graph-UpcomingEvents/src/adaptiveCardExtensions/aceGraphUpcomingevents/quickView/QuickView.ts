import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceGraphUpcomingeventsAdaptiveCardExtensionStrings';
import { IEvent } from '../../models/IEvent';
import { IAceGraphUpcomingeventsAdaptiveCardExtensionProps, IAceGraphUpcomingeventsAdaptiveCardExtensionState } from '../AceGraphUpcomingeventsAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  events: IEvent[];
}

export class QuickView extends BaseAdaptiveCardView<
  IAceGraphUpcomingeventsAdaptiveCardExtensionProps,
  IAceGraphUpcomingeventsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: "Upcoming Events",
      title: this.properties.title,
      description: this.properties.description,
      events: this.state.events
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
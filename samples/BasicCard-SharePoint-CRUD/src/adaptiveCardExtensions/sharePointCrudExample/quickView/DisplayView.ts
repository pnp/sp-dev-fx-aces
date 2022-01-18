import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, DemoItem } from '../../models/models';
import { find } from "@microsoft/sp-lodash-subset";
import { ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState } from '../SharePointCrudExampleAdaptiveCardExtension';

export interface IDisplayViewData {
  item: DemoItem;
}

export class DisplayView extends BaseAdaptiveCardView<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState,
  IDisplayViewData
> {
  private LOG_SOURCE: string = "🔶 CRUDDemoDisplayView";
  public get data(): IDisplayViewData {
    let item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
    return {
      item
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/DisplayView.json');
    return template;
  }

}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { DemoItem } from '../../models/models';
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
  private LOG_SOURCE = "🔶 CRUDDemoDisplayView";
  public get data(): IDisplayViewData {
    const item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
    return {
      item
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DisplayView.json');
  }

}
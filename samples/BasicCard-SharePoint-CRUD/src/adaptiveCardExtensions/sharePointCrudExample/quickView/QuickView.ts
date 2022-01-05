import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SharePointCrudExampleAdaptiveCardExtensionStrings';
import { DemoItem } from '../../models/models';
import { EDIT_VIEW_REGISTRY_ID, ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState } from '../SharePointCrudExampleAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { find } from "@microsoft/sp-lodash-subset";
import { SPCRUD } from '../../services/spcrud.service';

export interface IQuickViewData {
  title: string;
  items: DemoItem[];
  editItemButton: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";

  public get data(): IQuickViewData {
    return {
      items: this.state.items,
      title: strings.Title,
      editItemButton: strings.EditItem
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickView.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, itemId } = action.data;
        if (id === 'edit') {
          this.quickViewNavigator.push(EDIT_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: itemId });
        } else if (id === 'delete') {
          let item: DemoItem = find(this.state.items, { id: itemId });
          await SPCRUD.DeleteItem(item);
          let items = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);
          this.setState({ items: items });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (Quick View onAction) - ${err}`, LogLevel.Error);
    }
  }
}
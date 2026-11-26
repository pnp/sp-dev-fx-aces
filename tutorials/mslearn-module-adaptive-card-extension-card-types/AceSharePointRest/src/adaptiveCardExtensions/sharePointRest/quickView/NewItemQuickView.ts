import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/NewItemQuickView.json';
import {
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
} from '../SharePointRestAdaptiveCardExtension';
import {
  fetchListItems,
  addListItem
} from '../sp.service';

export interface INewItemQuickView { }

export class NewItemQuickView extends BaseAdaptiveCardQuickView<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
  INewItemQuickView
> {

  public get data(): INewItemQuickView {
    return {};
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      (async () => {
        // save item
        await addListItem(
          this.context,
          this.properties.listId,
          action.data.title,
          action.data.description
        );

        // refresh items
        this.setState({ listItems: await fetchListItems(this.context, this.properties.listId) });

        // remove quickview
        this.quickViewNavigator.close();
      })().catch(console.error);
    }
  }

}

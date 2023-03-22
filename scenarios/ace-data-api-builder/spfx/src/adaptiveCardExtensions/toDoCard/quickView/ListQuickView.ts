import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';
import { 
  IToDoCardAdaptiveCardExtensionProps, 
  IToDoCardAdaptiveCardExtensionState
} from '../ToDoCardAdaptiveCardExtension';
import { ToDoItem } from '../../../services';

export interface IListQuickViewData {
  subTitle: string;
  title: string;
  items: ToDoItem[];
  imageUpUrl: string;
  imageDownUrl: string;
  imageCompleted: string;
  imageNotCompleted: string;
  taskTitlePlaceholder: string;
}

export class ListQuickView extends BaseAdaptiveCardView<
  IToDoCardAdaptiveCardExtensionProps,
  IToDoCardAdaptiveCardExtensionState,
  IListQuickViewData
> {
  public get data(): IListQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      items: this.state.items,
      imageUpUrl:  require('../assets/up.png'),
      imageDownUrl:  require('../assets/down.png'),
      imageCompleted: require('../assets/completed.png'),
      imageNotCompleted: require('../assets/notCompleted.png'),
      taskTitlePlaceholder: strings.TaskTitlePlaceholder
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ListQuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {

    // Get the ID of the button pressed by the user
    const actionId = <string>action.id;

    // Check if the actionId is the one of an update Action.Submit button
    if (actionId.substring(0, 6) === "update") {

      // Determine the item to update, by id
      const itemsById = this.state.items.filter(o => o.id === action.data.id);

      // If we've found the target order
      if (itemsById !== undefined && itemsById.length > 0) {
        // Update the status accordingly to the new value we've got
        itemsById[0].completed = action.data[`changeStatus${action.data.itemIndex}`];
        // Update the title accordingly to the new value we've got
        itemsById[0].title = action.data[`changeTitle${action.data.itemIndex}`];
        // and update the order
        await this.properties.updateToDo(itemsById[0]);
      }
    }
    // Otherwise check if it is a request to delete the current order item
    // Check if the actionId is the one of an update Action.Submit button
    else if (actionId.substring(0, 6) === "delete") {
        // and delete the order
        await this.properties.deleteToDo(action.data.id);
    }
  }
}
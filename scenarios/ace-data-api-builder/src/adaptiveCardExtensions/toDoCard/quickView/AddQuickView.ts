import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Guid } from '@microsoft/sp-core-library';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';
import { ToDoItem } from '../../../services';
import { 
  IToDoCardAdaptiveCardExtensionProps, 
  IToDoCardAdaptiveCardExtensionState,
  CONFIRM_QUICK_VIEW_ID,
  ERROR_QUICK_VIEW_ID
} from '../ToDoCardAdaptiveCardExtension';

export interface IAddQuickViewData {
  taskTitlePlaceholder: string;
}

export class AddQuickView extends BaseAdaptiveCardView<
  IToDoCardAdaptiveCardExtensionProps,
  IToDoCardAdaptiveCardExtensionState,
  IAddQuickViewData
> {
  public get data(): IAddQuickViewData {
    return {
      taskTitlePlaceholder: strings.TaskTitlePlaceholder
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/AddQuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {

    // Prepare the new order instance
    const item: ToDoItem = {
      id: Guid.newGuid().toString(),
      completed: false,
      title: action.data.title,
    };
  
    const newItem = await this.properties.addToDo(item);
    
    if (newItem === undefined) {
      this.quickViewNavigator.replace(ERROR_QUICK_VIEW_ID);
    } else {
      this.quickViewNavigator.replace(CONFIRM_QUICK_VIEW_ID);
    }

  }
}
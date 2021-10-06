import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, IContainer } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import { Task } from '../../../models/cg.models';
import { DETAILED_QUICK_VIEW_REGISTRY_ID, ITasklistAdaptiveCardExtensionProps, ITasklistAdaptiveCardExtensionState } from '../TasklistAdaptiveCardExtension';

export interface IQuickViewData {
  userName: string;
  userPhoto: string;
  description: string;
  tasks: Task[];
}

export class QuickView extends BaseAdaptiveCardView<
  ITasklistAdaptiveCardExtensionProps,
  ITasklistAdaptiveCardExtensionState,
  IQuickViewData
> {

  private LOG_SOURCE: string = "🔶 TasklistQuickView";
  public get data(): IQuickViewData {
    return {
      userName: this.state.taskList.userName,
      userPhoto: this.state.taskList.userPhoto,
      description: this.properties.description,
      tasks: this.state.taskList.tasks
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/QuickViewTemplate.json');
    try {
      let container: IContainer = template.body[1];
      container.$data = "${tasks}";
      template.body[1] = container;
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (template) - ${err}`, LogLevel.Error);
    }

    return template;
  }

  public onAction(action: IActionArguments): void {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'selectAction') {
          this.quickViewNavigator.push(DETAILED_QUICK_VIEW_REGISTRY_ID, true);
          this.setState({ currentIndex: newIndex });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}
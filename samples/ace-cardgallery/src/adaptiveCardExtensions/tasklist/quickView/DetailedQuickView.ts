import { BaseAdaptiveCardView, IActionArguments, ISPFxAdaptiveCard, IAction, ActionStyle, IAdaptiveCard, IShowCardAction } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import * as strings from 'TasklistAdaptiveCardExtensionStrings';
import { ITasklistAdaptiveCardExtensionProps, ITasklistAdaptiveCardExtensionState } from '../TasklistAdaptiveCardExtension';

export interface IDetailedViewData {
  id: number;
  title: string;
  titleLabel: string;
  assignedTo: string;
  assignedToLabel: string;
  dueDate: string;
  dueDateLabel: string;

}

export interface IAC {
  id: string;
  type: string;
}

export interface ITextBox extends IAC {
  text: string;
  wrap: boolean;
}

export class TextBox implements ITextBox {
  constructor(
    public id: string = "",
    public text: string = "",
    public type: string = "TextBlock",
    public wrap: boolean = true
  ) { }
}

export class TextAnswer implements IAC {
  constructor(
    public id: string = "",
    public value: string = "${value}",
    public type: string = "Input.Text",
  ) { }
}

export class DatePicker implements IAC {
  constructor(
    public id: string = "",
    public value: string = "${value}",
    public type: string = "Input.Date",
  ) { }
}

export class DetailedView extends BaseAdaptiveCardView<
  ITasklistAdaptiveCardExtensionProps,
  ITasklistAdaptiveCardExtensionState,
  IDetailedViewData
> {
  private LOG_SOURCE: string = "🔶 TasklistDetailedQuickView";
  public get data(): IDetailedViewData {
    const { assignedTo, title, dueDate, id } = this.state.taskList.tasks[this.state.currentIndex];
    const assignedToLabel: string = `${strings.AssignedToLabel}: ${assignedTo}`;
    const dueDateLabel: string = `${strings.DueDateLabel}: ${dueDate}`;
    const titleLabel: string = strings.TitleFieldLabel;
    return {
      id,
      title,
      titleLabel,
      assignedTo,
      assignedToLabel,
      dueDate,
      dueDateLabel
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/DetailedQuickViewTemplate.json');
    try {
      const items = [];
      items.push(new TextBox('titleLabel', strings.TaskTitleLabel));
      items.push(new TextAnswer('title', '${title}'));
      items.push(new TextBox('assignedToLabel', strings.AssignedToLabel));
      items.push(new TextAnswer('assignedTo', '${assignedTo}'));
      items.push(new TextBox('dueDateLabel', strings.DueDateLabel));
      items.push(new DatePicker('dueDate', '${dueDate}'));

      template.body[0].columns[0].items = items;

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${err}`, LogLevel.Error);
    }


    return template;
  }

  public onAction(action: IActionArguments): void {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'save') {
          const { taskList } = this.state;
          const task = taskList.tasks[this.state.currentIndex];
          task.title = action.data.title;
          task.assignedTo = action.data.assignedTo;
          task.dueDate = action.data.dueDate;
          this.setState({ taskList: taskList });
          this.quickViewNavigator.pop();
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}
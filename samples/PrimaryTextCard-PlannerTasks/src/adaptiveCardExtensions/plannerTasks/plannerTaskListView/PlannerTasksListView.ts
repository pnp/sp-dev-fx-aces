import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import Utilities from '../../../common/utilities';
import { IPlannerTasks } from '../../../interfaces/IPlannerTasks';
import { IPlannerTasksAdaptiveCardExtensionProps, IPlannerTasksAdaptiveCardExtensionState, PLANNERTASKS_LIST_QUICKVIEW } from '../PlannerTasksAdaptiveCardExtension';

export interface IPlannerTasksListViewData {
  tasks: IPlannerTasks[];
  selectedTasksType: string;
}


export class PlannerTasksListView extends BaseAdaptiveCardView<
  IPlannerTasksAdaptiveCardExtensionProps,
  IPlannerTasksAdaptiveCardExtensionState,
  IPlannerTasksListViewData
> {

  public get data(): IPlannerTasksListViewData {
    const { tasks, selectedTasksType } = this.state;
    let filteredTasks: IPlannerTasks[] = [];
    if (selectedTasksType === "due") {
      filteredTasks = tasks.filter(t => t.isOverDue == false)
    }
    if (selectedTasksType === "overdue") {
      filteredTasks = tasks.filter(t => t.isOverDue == true)
    }
    if (selectedTasksType === "inprogress") {
      filteredTasks = tasks.filter(t => t.status == 'In Progress')
    }
    if (selectedTasksType === "pending") {
      filteredTasks = tasks.filter(t => t.status == 'Pending')
    }
    if (selectedTasksType === "completed") {
      filteredTasks = tasks.filter(t => t.status == 'Completed')
    }
    return {
      tasks: filteredTasks,
      selectedTasksType: Utilities.GetSelectedTypeName(selectedTasksType)

    };
  }
  public onAction(action: IActionArguments): void {


    if (action.id.indexOf("due") > -1) {
      this.quickViewNavigator.push(PLANNERTASKS_LIST_QUICKVIEW);
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/PlannerTasksListViewTemplate.json');
  }
}
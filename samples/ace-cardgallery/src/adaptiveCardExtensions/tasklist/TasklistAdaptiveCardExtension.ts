import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, RenderType } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DetailedView } from './quickView/DetailedQuickView';
import { TasklistPropertyPane } from './TasklistPropertyPane';
import { TaskList } from '../../models/cg.models';
import { cg } from '../../services/cg.service';

export interface ITasklistAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface ITasklistAdaptiveCardExtensionState {
  taskList: TaskList;
  currentIndex: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'Tasklist_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Tasklist_QUICK_VIEW';
export const DETAILED_QUICK_VIEW_REGISTRY_ID: string = 'Tasklist_DETAILED_QUICK_VIEW';

export default class TasklistAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITasklistAdaptiveCardExtensionProps,
  ITasklistAdaptiveCardExtensionState
> {

  private LOG_SOURCE: string = "🔶 TasklistAdaptiveCardExtension";
  private _cardIndex: number;

  private _deferredPropertyPane: TasklistPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const taskList: TaskList = cg.GetTasks();

      this.state = {
        taskList: taskList,
        currentIndex: 0
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(DETAILED_QUICK_VIEW_REGISTRY_ID, () => new DetailedView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${err}`, LogLevel.Error);
    }
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Tasklist-property-pane'*/
      './TasklistPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TasklistPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  protected onRenderTypeChanged(oldRenderType: RenderType): void {
    if (oldRenderType === 'QuickView') {
      // Reset to the Card state when the Quick view was opened.
      this.setState({ currentIndex: this._cardIndex });
    } else {
      // The Quick view is opened, save the current index.
      this._cardIndex = this.state.currentIndex;
    }
  }
}

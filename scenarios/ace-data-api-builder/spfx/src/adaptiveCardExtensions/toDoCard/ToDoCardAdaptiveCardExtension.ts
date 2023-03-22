import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { ListQuickView } from './quickView/ListQuickView';
import { AddQuickView } from './quickView/AddQuickView';
import { ConfirmQuickView } from './quickView/ConfirmQuickView';
import { ErrorQuickView } from './quickView/ErrorQuickView';
import { ToDoCardPropertyPane } from './ToDoCardPropertyPane';

import { DisplayMode } from '@microsoft/sp-core-library';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';
import { IToDoService, ToDoService, ToDoItem } from '../../services';

export interface IToDoCardAdaptiveCardExtensionProps {
  apiUrl: string;
  listToDo(): Promise<void>;
  addToDo(item: ToDoItem): Promise<ToDoItem>;
  updateToDo(item: ToDoItem): Promise<ToDoItem>;
  deleteToDo(id: string): Promise<void>;
}

export interface IToDoCardAdaptiveCardExtensionState {
  description: string;
  items: ToDoItem[];
  error?: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'ToDoCard_CARD_VIEW';
export const LIST_QUICK_VIEW_ID: string = 'ListToDo_QUICK_VIEW';
export const ADD_QUICK_VIEW_ID: string = 'AddToDo_QUICK_VIEW';
export const CONFIRM_QUICK_VIEW_ID: string = 'Confirm_QUICK_VIEW';
export const ERROR_QUICK_VIEW_ID: string = 'Error_QUICK_VIEW';

export default class ToDoCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IToDoCardAdaptiveCardExtensionProps,
  IToDoCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ToDoCardPropertyPane | undefined;
  private _toDoService: IToDoService = null;

  public async onInit(): Promise<void> {
    this.state = {
      description: strings.LoadingMessage,
      items: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(LIST_QUICK_VIEW_ID, () => new ListQuickView());
    this.quickViewNavigator.register(ADD_QUICK_VIEW_ID, () => new AddQuickView());
    this.quickViewNavigator.register(CONFIRM_QUICK_VIEW_ID, () => new ConfirmQuickView());
    this.quickViewNavigator.register(ERROR_QUICK_VIEW_ID, () => new ErrorQuickView());

    // Build the middleware service and initialize it
    this._toDoService = this.context.serviceScope.consume(ToDoService.serviceKey);

    this.properties.listToDo = this.listToDo;
    this.properties.addToDo = this.addToDo;
    this.properties.updateToDo = this.updateToDo;
    this.properties.deleteToDo = this.deleteToDo;

    setTimeout(this.listToDo, 500);

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ToDoCard-property-pane'*/
      './ToDoCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ToDoCardPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  private listToDo = async (): Promise<void> => {

    // Skip in case we are missing settings
    if (this.properties.apiUrl === undefined || this.properties.apiUrl.length === 0)
    {
      this.setState({
        description: strings.ConfigureMessage,
        items: []
      });
      if (this.displayMode === DisplayMode.Edit) {
        this.context.propertyPane.open();
      }
    }
    else
    {
      try {
        // Configure the service endpoint
        this._toDoService.Initialize(this.properties.apiUrl);

        // Use the service to get the list of ToDo items
        const items = await this._toDoService.ListToDo();

        this.setState({
          description: `You have ${items.length} ToDo items`,
          items: items
        });
        
      } catch (error) {

        this.setState({
          description: error.message,
          error: error.message,
          items: []
        });

        console.log(error);
      }
    }
  }

  private addToDo = async (item: ToDoItem): Promise<ToDoItem> => {

    // Skip in case we are missing settings
    if (this.properties.apiUrl === undefined || this.properties.apiUrl.length === 0)
    {
      this.setState({
        description: strings.ConfigureMessage,
        items: []
      });
      if (this.displayMode === DisplayMode.Edit) {
        this.context.propertyPane.open();
      }

      return null;
    }
    else
    {
      try {
        // Configure the service endpoint
        this._toDoService.Initialize(this.properties.apiUrl);

        // Use the service to add a new ToDo item
        const addedItem = await this._toDoService.AddToDo(item);
        const items = await this._toDoService.ListToDo();

        this.setState({
          description: `You have ${items.length} ToDo items`,
          items: items
        });

        return addedItem;

      } catch (error) {

        this.setState({
          description: error.message,
          error: error.message,
          items: []
        });

        console.log(error);
      }
    }
  }

  private updateToDo = async (item: ToDoItem): Promise<ToDoItem> => {

    // Skip in case we are missing settings
    if (this.properties.apiUrl === undefined || this.properties.apiUrl.length === 0)
    {
      this.setState({
        description: strings.ConfigureMessage,
        items: []
      });
      if (this.displayMode === DisplayMode.Edit) {
        this.context.propertyPane.open();
      }

      return null;
    }
    else
    {
      try {
        // Configure the service endpoint
        this._toDoService.Initialize(this.properties.apiUrl);

        // Use the service to update the ToDo item
        const updatedItem = await this._toDoService.UpdateToDo(item);
        const items = await this._toDoService.ListToDo();

        this.setState({
          description: `You have ${items.length} ToDo items`,
          items: items
        });

        return updatedItem;

      } catch (error) {

        this.setState({
          description: error.message,
          error: error.message,
          items: []
        });

        console.log(error);
      }
    }
  }

  private deleteToDo = async (id: string): Promise<void> => {

    // Skip in case we are missing settings
    if (this.properties.apiUrl === undefined || this.properties.apiUrl.length === 0)
    {
      this.setState({
        description: strings.ConfigureMessage,
        items: []
      });
      if (this.displayMode === DisplayMode.Edit) {
        this.context.propertyPane.open();
      }
    }
    else
    {
      try {
        // Configure the service endpoint
        this._toDoService.Initialize(this.properties.apiUrl);

        // Use the service to delete the ToDo item
        await this._toDoService.DeleteToDo(id);
        const items = await this._toDoService.ListToDo();

        this.setState({
          description: `You have ${items.length} ToDo items`,
          items: items
        });

      } catch (error) {

        this.setState({
          description: error.message,
          error: error.message,
          items: []
        });

        console.log(error);
      }
    }
  }
}

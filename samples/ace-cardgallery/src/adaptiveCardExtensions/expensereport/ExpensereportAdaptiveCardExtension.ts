import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ExpensereportPropertyPane } from './ExpensereportPropertyPane';
import { Expense, ExpenseReport } from '../../models/cg.models';
import { cg } from '../../services/cg.service';

export interface IExpensereportAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IExpensereportAdaptiveCardExtensionState {
  expenseReports: ExpenseReport[];
  currentIndex: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'Expensereport_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Expensereport_QUICK_VIEW';

export default class ExpensereportAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IExpensereportAdaptiveCardExtensionProps,
  IExpensereportAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 ExpensereportAdaptiveCardExtension";
  private _deferredPropertyPane: ExpensereportPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const expenseReports: ExpenseReport[] = cg.GetExpenseReports();

      this.state = {
        expenseReports: expenseReports,
        currentIndex: 0
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err}`, LogLevel.Error);
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
      /* webpackChunkName: 'Expensereport-property-pane'*/
      './ExpensereportPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ExpensereportPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}

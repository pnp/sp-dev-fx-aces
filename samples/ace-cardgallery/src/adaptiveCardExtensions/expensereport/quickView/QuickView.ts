import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import { ExpenseField, ExpenseReport } from '../../../models/cg.models';
import { IExpensereportAdaptiveCardExtensionProps, IExpensereportAdaptiveCardExtensionState } from '../ExpensereportAdaptiveCardExtension';

export interface IQuickViewData {
  expenseReport: ExpenseReport;

}

export class QuickView extends BaseAdaptiveCardView<
  IExpensereportAdaptiveCardExtensionProps,
  IExpensereportAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const expenseReport = this.state.expenseReports[this.state.currentIndex];
    return {
      expenseReport: expenseReport,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'approve') {
          let expenseReports = this.state.expenseReports;
          let expenseReport = expenseReports[this.state.currentIndex];
          expenseReport.status = "Approved";
          expenseReport.statusUrl = "https://adaptivecards.io/content/approved.png";
          expenseReport.approvalDate = new Date().toLocaleDateString();
          this.setState({ expenseReports: expenseReports });
          this.quickViewNavigator.close();
        } else if (id === 'rejectsend') {
          let expenseReports = this.state.expenseReports;
          let expenseReport = expenseReports[this.state.currentIndex];
          expenseReport.status = "Rejected";
          expenseReport.statusUrl = "https://adaptivecards.io/content/rejected.png";
          expenseReport.approvalDate = new Date().toLocaleDateString();
          this.setState({ expenseReports: expenseReports });
          this.quickViewNavigator.close();
        } else if (id === 'send') {
          let expenseReports: ExpenseReport[] = this.state.expenseReports;
          let expenseReport: ExpenseReport = expenseReports[this.state.currentIndex];
          expenseReport.expenses[0].customFields.push(new ExpenseField(expenseReport.expenses[0].customFields.length, action.data.comment0, action.data.comment0));
          this.setState({ expenseReports: expenseReports });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}
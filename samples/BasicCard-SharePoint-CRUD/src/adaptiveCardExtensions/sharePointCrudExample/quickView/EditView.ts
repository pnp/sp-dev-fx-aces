import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, DemoItem } from '../../models/models';
import { find } from "@microsoft/sp-lodash-subset";
import { Logger, LogLevel } from "@pnp/logging";
import { SPCRUD } from '../../services/spcrud.service';
import { ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState } from '../SharePointCrudExampleAdaptiveCardExtension';

export interface IEditViewData {
  item: DemoItem;
  claimTypeValues: Choice[];
  claimStatusValues: Choice[];
}

export class EditView extends BaseAdaptiveCardView<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState,
  IEditViewData
> {
  private LOG_SOURCE: string = "🔶 CRUDDemoEditView";
  public get data(): IEditViewData {
    let item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
    let claimStatusValues: Choice[] = SPCRUD.ChoiceFieldDDLValues;
    let claimTypeValues: Choice[] = SPCRUD.ChoiceFieldRadioValues;
    return {
      item,
      claimTypeValues,
      claimStatusValues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/EditView.json');
    return template;
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'update') {
          let item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
          item.title = action.data.title;
          item.multilinetext = action.data.multilinetext;
          item.choicefieldddl = action.data.choicefieldddl;
          item.choicefieldradio = action.data.choicefieldradio;
          item.choicefieldcheckbox = action.data.choicefieldcheckbox;
          item.numberfield = action.data.numberfield;
          item.currencyfield = action.data.currencyfield;
          item.datetimefield = action.data.datatimefield;
          item.yesnofield = action.data.yesnofield;
          await SPCRUD.UpdateItem(item);
          let items = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);
          this.setState({ items: items });
          this.quickViewNavigator.pop();
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}
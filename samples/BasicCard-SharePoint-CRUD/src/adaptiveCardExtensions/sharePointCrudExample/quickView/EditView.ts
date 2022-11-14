import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, DemoItem } from '../../models/models';
import { find } from "@microsoft/sp-lodash-subset";
import { SPCRUD } from '../../services/spcrud.service';
import { ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState } from '../SharePointCrudExampleAdaptiveCardExtension';

export interface IEditViewData {
  item: DemoItem;
  choiceFieldDDLValues: Choice[];
  choiceFieldRadioValues: Choice[];
  choiceFieldCheckboxValues: Choice[];
}

export class EditView extends BaseAdaptiveCardView<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState,
  IEditViewData
> {
  private LOG_SOURCE = "🔶 CRUDDemoEditView";
  public get data(): IEditViewData {
    const item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
    const choiceFieldDDLValues: Choice[] = SPCRUD.ChoiceFieldDDLValues;
    const choiceFieldRadioValues: Choice[] = SPCRUD.ChoiceFieldRadioValues;
    const choiceFieldCheckboxValues: Choice[] = SPCRUD.ChoiceFieldCheckboxValues;
    return {
      item,
      choiceFieldDDLValues,
      choiceFieldRadioValues,
      choiceFieldCheckboxValues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/EditView.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'update') {
          const item: DemoItem = find(this.state.items, { id: this.state.currentItemID });
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
          const items = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);
          this.setState({ items: items });
          this.quickViewNavigator.pop();
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(Quick Edit onAction) - ${err.message}`);
    }
  }
}
import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, DemoItem } from '../../models/models';
import { SPCRUD } from '../../services/spcrud.service';
import { ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../SharePointCrudExampleAdaptiveCardExtension';

export interface INewViewData {
  item: DemoItem;
  choiceFieldDDLValues: Choice[];
  choiceFieldRadioValues: Choice[];
  choiceFieldCheckboxValues: Choice[];
}

export class NewView extends BaseAdaptiveCardView<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState,
  INewViewData
> {
  private LOG_SOURCE = "🔶 CRUDDemoNewView";
  public get data(): INewViewData {
    const item: DemoItem = new DemoItem();
    item.datetimefield = new Date().toUTCString();
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
    return require('./template/NewView.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'save') {
          const item: DemoItem = new DemoItem();
          item.title = action.data.title;
          item.multilinetext = action.data.multilinetext;
          item.choicefieldddl = action.data.choicefieldddl;
          item.choicefieldradio = action.data.choicefieldradio;
          item.choicefieldcheckbox = action.data.choicefieldcheckbox;
          item.numberfield = action.data.numberfield;
          item.currencyfield = action.data.currencyfield;
          item.datetimefield = action.data.datatimefield;
          item.yesnofield = action.data.yesnofield;
          await SPCRUD.SaveItem(item);
          const items = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);
          this.setState({ items: items });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID);
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(New View onAction) - ${err.message}`);
    }
  }
}
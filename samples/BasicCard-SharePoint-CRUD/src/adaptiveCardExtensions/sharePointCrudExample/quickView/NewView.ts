import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, DemoItem } from '../../models/models';
import { Logger, LogLevel } from "@pnp/logging";
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
  private LOG_SOURCE: string = "🔶 CRUDDemoNewView";
  public get data(): INewViewData {
    let item: DemoItem = new DemoItem();
    item.datetimefield = new Date().toUTCString();
    let choiceFieldDDLValues: Choice[] = SPCRUD.ChoiceFieldDDLValues;
    let choiceFieldRadioValues: Choice[] = SPCRUD.ChoiceFieldRadioValues;
    let choiceFieldCheckboxValues: Choice[] = SPCRUD.ChoiceFieldCheckboxValues;
    return {
      item,
      choiceFieldDDLValues,
      choiceFieldRadioValues,
      choiceFieldCheckboxValues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/NewView.json');
    return template;
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'save') {
          let item: DemoItem = new DemoItem();
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
          let items = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);
          this.setState({ items: items });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID);
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}
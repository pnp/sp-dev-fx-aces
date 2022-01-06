import * as lodash from "lodash";
import { Logger, LogLevel } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { Choice, DemoItem, Lists } from "../models/models";
import { Web } from "@pnp/sp/webs";

export interface ISPCRUDService {
  Ready: boolean;
  GetItemsByUser: (userId: string) => Promise<DemoItem[]>;
  ChoiceFieldDDLValues: Choice[];
  ChoiceFieldRadioValues: Choice[];
  ChoiceFieldCheckboxValues: Choice[];
  SaveItem: (item: DemoItem) => Promise<void>;
  UpdateItem: (item: DemoItem) => Promise<void>;
  DeleteItem: (item: DemoItem) => Promise<void>;
}

export class SPCRUDService implements ISPCRUDService {
  private LOG_SOURCE: string = "🔶 SPCRUDService";
  private _ready: boolean = false;
  private _currentSiteUrl: string = "";
  private _choiceFieldDDLValues: Choice[] = [];
  private _choiceFieldRadioValues: Choice[] = [];
  private _choiceFieldCheckboxValues: Choice[] = [];

  constructor() {
  }
  public get Ready(): boolean {
    return this._ready;
  }
  public get ChoiceFieldDDLValues(): Choice[] {
    return this._choiceFieldDDLValues;
  }
  public get ChoiceFieldRadioValues(): Choice[] {
    return this._choiceFieldRadioValues;
  }
  public get ChoiceFieldCheckboxValues(): Choice[] {
    return this._choiceFieldCheckboxValues;
  }

  public async Init(currentSiteUrl: string) {
    try {
      this._ready = true;
      this._currentSiteUrl = currentSiteUrl;
      this._choiceFieldDDLValues = await this._getChoiceFieldValues("ChoiceFieldDDL");
      this._choiceFieldRadioValues = await this._getChoiceFieldValues("ChoiceFieldRadio");
      this._choiceFieldCheckboxValues = await this._getChoiceFieldValues("ChoiceFieldCheckbox");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  public async GetItemsByUser(userId: string): Promise<DemoItem[]> {
    let retVal: DemoItem[] = [];
    try {
      const web = Web(this._currentSiteUrl);
      let items = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('Created', false).select('Id', 'Title', 'MultiLineText', 'Created', 'Modified', 'Editor/FirstName', 'Editor/LastName', 'Editor/ID', 'ChoiceFieldDDL', 'ChoiceFieldRadio', 'ChoiceFieldCheckbox', 'NumberField', 'CurrencyField', 'DateTimeField', 'YesNoField').expand('Editor').filter(`Author/EMail eq \'${userId}\'`).get();
      items.map((item) => {
        let checkBoxValues: string[] = item.ChoiceFieldCheckbox;
        let checkBoxValuesSelected: string = "";
        checkBoxValues.map((value, index) => {
          if (index > 0) {
            checkBoxValuesSelected = checkBoxValuesSelected + "," + value;
          } else {
            checkBoxValuesSelected = value;
          }
          return (checkBoxValuesSelected);
        });
        return (
          retVal.push(new DemoItem(item.id, item.Title, item.MultiLineText, item.ChoiceFieldDDL, item.ChoiceFieldRadio, checkBoxValuesSelected, item.NumberField, item.CurrencyField, item.DateTimeField, item.YesNoField.toString(), item.Editor.FirstName + " " + item.Editor.LastName))
        );

      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetItemsByUser) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async UpdateItem(item: DemoItem): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        Title: item.title,
        MultiLineText: item.multilinetext,
        ChoiceFieldDDL: item.choicefieldddl,
        ChoiceFieldRadio: item.choicefieldradio,
        ChoiceFieldCheckbox: item.choicefieldcheckbox,
        NumberField: item.numberfield,
        CurrencyField: item.currencyfield,
        DateTimeField: item.datetimefield,
        YesNoField: item.yesnofield
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (UpdateItem) - ${err.message}`, LogLevel.Error);
    }
  }

  public async SaveItem(item: DemoItem): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        Title: item.title,
        MultiLineText: item.multilinetext,
        ChoiceFieldDDL: item.choicefieldddl,
        ChoiceFieldRadio: item.choicefieldradio,
        ChoiceFieldCheckbox: item.choicefieldcheckbox,
        NumberField: item.numberfield,
        CurrencyField: item.currencyfield,
        DateTimeField: item.datetimefield,
        YesNoField: item.yesnofield
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (SaveItem) - ${err.message}`, LogLevel.Error);
    }
  }

  public async DeleteItem(item: DemoItem): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).delete();
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (DeleteItem) - ${err.message}`, LogLevel.Error);
    }
  }

  private async _getChoiceFieldValues(fieldName: string): Promise<Choice[]> {
    let retVal: Choice[] = [];
    try {
      const web = Web(this._currentSiteUrl);
      const choiceField: any = await web.lists.getByTitle(Lists.DEMOITEMSLIST).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string) => {
        retVal.push(new Choice(choice, choice));
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetChoiceFieldValues) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

}
export const SPCRUD = new SPCRUDService();
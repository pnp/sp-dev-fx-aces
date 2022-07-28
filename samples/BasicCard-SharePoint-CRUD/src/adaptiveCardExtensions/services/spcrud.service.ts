import { Logger, LogLevel } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { Web } from "@pnp/sp/webs";
import { Choice, DemoItem, Lists } from "../models/models";
import { CalendarType, ChoiceFieldFormatType, DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType } from "@pnp/sp/fields";
import { IFieldAddResult, _Field } from "@pnp/sp/fields/types";


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
      await this._configList();
      this._choiceFieldCheckboxValues = await this._getChoiceFieldValues("ChoiceFieldCheckbox");
      this._choiceFieldDDLValues = await this._getChoiceFieldValues("ChoiceFieldDDL");
      this._choiceFieldRadioValues = await this._getChoiceFieldValues("ChoiceFieldRadio");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  private async _configList(): Promise<boolean> {
    let retval: boolean = true;
    try {
      const web = Web(this._currentSiteUrl);
      const l = await web.lists.ensure(Lists.DEMOITEMSLIST);
      if (l.created) {
        const multiLineText = await l.list.fields.addMultilineText("MultiLineText", 6, false);
        const choiceFieldDDL = await l.list.fields.addChoice("ChoiceFieldDDL", ["Choice 1", "Choice 2", "Choice 3"], ChoiceFieldFormatType.Dropdown, false);
        const choiceFieldRadio = await l.list.fields.addChoice("ChoiceFieldRadio", ["Radio 1", "Radio 2", "Radio 3"], ChoiceFieldFormatType.RadioButtons, false);
        const choiceFieldCheckbox = await l.list.fields.addMultiChoice("ChoiceFieldCheckbox", ["Checkbox 1", "Checkbox 2", "Checkbox 3"], false);
        const currencyField = await l.list.fields.addCurrency("CurrencyField", 0, 100000, 1033);
        const dateTimeField = await l.list.fields.addDateTime("DateTimeField", DateTimeFieldFormatType.DateOnly);
        const numberField = await l.list.fields.addNumber("NumberField");
        const yesNoField = await l.list.fields.addBoolean("YesNoField");
      }

    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_configList) - ${err.message}`, LogLevel.Error);
    }
    return retval;
  }

  public async GetItemsByUser(userId: string): Promise<DemoItem[]> {
    let retVal: DemoItem[] = [];
    try {
      const web = Web(this._currentSiteUrl);
      let items = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('Created', false).select('Id', 'Title', 'MultiLineText', 'Created', 'Modified', 'Editor/FirstName', 'Editor/LastName', 'Editor/ID', 'ChoiceFieldDDL', 'ChoiceFieldRadio', 'ChoiceFieldCheckbox', 'NumberField', 'CurrencyField', 'DateTimeField', 'YesNoField').expand('Editor').filter(`Author/EMail eq \'${userId}\'`).get();
      items.map((item) => {
        let checkBoxValues: string[] = item.ChoiceFieldCheckbox;
        let checkBoxValuesSelected: string = "";
        checkBoxValues?.map((value, index) => {
          if (index > 0) {
            checkBoxValuesSelected = checkBoxValuesSelected + "," + value;
          } else {
            checkBoxValuesSelected = value;
          }
          return (checkBoxValuesSelected);
        });
        const dateFieldString: string = (item.DateTimeField) ? item.DateTimeField : new Date().toUTCString();
        return (
          retVal.push(new DemoItem(
            item.Id,
            item.Title,
            item.MultiLineText,
            item.ChoiceFieldDDL,
            item.ChoiceFieldRadio,
            checkBoxValuesSelected,
            item.NumberField,
            item.CurrencyField,
            dateFieldString,
            item.YesNoField?.toString() || "No",
            item.Editor.ID,
            item.Editor.FirstName + " " + item.Editor.LastName,
            item.Modified))
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
      let checkboxFieldValues: string[] = [];
      if (item.choicefieldcheckbox) {
        checkboxFieldValues = item.choicefieldcheckbox.split(",");
      }
      const i = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        Title: item.title,
        MultiLineText: item.multilinetext,
        //Because these are just strings for choice we can 
        //Pass a string
        ChoiceFieldDDL: item.choicefieldddl,
        ChoiceFieldRadio: item.choicefieldradio,
        //A multi-select field needs an array passed as the value
        ChoiceFieldCheckbox: { results: checkboxFieldValues },
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
      let checkboxFieldValues: string[] = [];
      if (item.choicefieldcheckbox) {
        checkboxFieldValues = item.choicefieldcheckbox.split(",");
      }
      const i = await web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        Title: item.title,
        MultiLineText: item.multilinetext,
        //Because these are just strings for choice we can 
        //Pass a string
        ChoiceFieldDDL: item.choicefieldddl,
        ChoiceFieldRadio: item.choicefieldradio,
        //A multi-select field needs an array passed as the value
        ChoiceFieldCheckbox: { results: checkboxFieldValues },
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

  //This sets up the choice fields. You could extend this for a Lookup field by getting the list/items in a specific list
  //and binding it to a drop down in the adaptive card
  private async _getChoiceFieldValues(fieldName: string): Promise<Choice[]> {
    let retVal: Choice[] = [];
    try {
      const web = await Web(this._currentSiteUrl);
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

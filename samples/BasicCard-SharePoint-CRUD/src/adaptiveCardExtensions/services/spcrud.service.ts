import { PageContext } from "@microsoft/sp-page-context";
import { Choice, DemoItem, IFieldList, ListFields, Lists } from "../models/models";
import { CalendarType, DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType, UrlFieldFormatType } from "@pnp/sp/fields";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import { IView } from "@pnp/sp/views";

export interface ISPCRUDService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  Init(serviceScope: ServiceScope): Promise<void>;
  GetItemsByUser: (userId: string) => Promise<DemoItem[]>;
  ChoiceFieldDDLValues: Choice[];
  ChoiceFieldRadioValues: Choice[];
  ChoiceFieldCheckboxValues: Choice[];
  SaveItem: (item: DemoItem) => Promise<void>;
  UpdateItem: (item: DemoItem) => Promise<void>;
  DeleteItem: (item: DemoItem) => Promise<void>;
}

export class SPCRUDService implements ISPCRUDService {
  private LOG_SOURCE = "🔶 SPCRUDService";
  public static readonly serviceKey: ServiceKey<SPCRUDService> =
    ServiceKey.create<SPCRUDService>(
      "SPCRUDService:ISPCRUDService",
      SPCRUDService
    );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _ready = false;
  private _webUrl = "";
  private _choiceFieldDDLValues: Choice[] = [];
  private _choiceFieldRadioValues: Choice[] = [];
  private _choiceFieldCheckboxValues: Choice[] = [];

  public async Init(serviceScope: ServiceScope): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        this._ready = true;
        await this._configList(Lists.DEMOITEMSLIST, "", ListFields);
        this._choiceFieldCheckboxValues = await this._getChoiceFieldValues("ChoiceFieldCheckbox");
        this._choiceFieldDDLValues = await this._getChoiceFieldValues("ChoiceFieldDDL");
        this._choiceFieldRadioValues = await this._getChoiceFieldValues("ChoiceFieldRadio");
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (init) - ${err}`);
    }
  }
  public get ready(): boolean {
    return this._ready;
  }

  public get sp(): SPFI {
    return this._sp;
  }

  public get pageContext(): PageContext {
    return this._pageContext;
  }

  public get webUrl(): string {
    return this._webUrl;
  }
  public set webUrl(value: string) {
    this._webUrl = value;
    try {
      this._sp = spfi(value).using(SPFx({ pageContext: this._pageContext }));
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (webUrl) - cannot connect to new web - ${err}`
      );
    }
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

  public async _configList(
    listName: string,
    listDescription: string,
    fieldList: IFieldList[]
  ): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.ensure(listName, listDescription, 100, false, { OnQuickLaunch: true });
      if (list.created) {
        for (let i = 0; i < fieldList.length; i++) {
          if (fieldList[i].props.FieldTypeKind === 2) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addText(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 3) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.createFieldAsXml(
                `<Field Type="Note" Name="${fieldList[i].name}" DisplayName="${fieldList[i].name}" Required="FALSE" RichText="${fieldList[i].props.richText}" RichTextMode="FullHtml" />`
              );
          } else if (fieldList[i].props.FieldTypeKind === 4) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addDateTime(fieldList[i].name, {
                DisplayFormat: DateTimeFieldFormatType.DateOnly,
                DateTimeCalendarType: CalendarType.Gregorian,
                FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
              });
          } else if (fieldList[i].props.FieldTypeKind === 6) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addChoice(fieldList[i].name, {
                Choices: fieldList[i].props.choices,
                EditFormat: fieldList[i].props.editFormat
              });
          } else if (fieldList[i].props.FieldTypeKind === 8) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addBoolean(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 9) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addNumber(fieldList[i].name, {
                MinimumValue: fieldList[i].props.minValue,
                MaximumValue: fieldList[i].props.maxValue
              });
          } else if (fieldList[i].props.FieldTypeKind === 10) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addCurrency(fieldList[i].name, {
                MinimumValue: fieldList[i].props.minValue,
                MaximumValue: fieldList[i].props.maxValue,
                CurrencyLocaleId: fieldList[i].props.localID
              });
          } else if (fieldList[i].props.FieldTypeKind === 11) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addUrl(fieldList[i].name, {
                DisplayFormat: UrlFieldFormatType.Hyperlink,
              });
          } else if (fieldList[i].props.FieldTypeKind === 12) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addNumber(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 15) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addMultiChoice(fieldList[i].name, {
                Choices: fieldList[i].props.choices,
                FillInChoice: false,

              });
          }
        }
        const view: IView = await this._sp.web.lists.getById(list.data.Id).defaultView;
        for (let i = 0; i < fieldList.length; i++) {
          await view.fields.add(fieldList[i].name);
        }
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(createList) - ${err}`);
    }
    return retVal;
  }

  public async GetItemsByUser(userId: string): Promise<DemoItem[]> {
    const retVal: DemoItem[] = [];
    try {
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('Created', false).select('Id', 'Title', 'MultiLineText', 'Created', 'Modified', 'Editor/FirstName', 'Editor/LastName', 'Editor/ID', 'ChoiceFieldDDL', 'ChoiceFieldRadio', 'ChoiceFieldCheckbox', 'NumberField', 'CurrencyField', 'DateTimeField', 'YesNoField').expand('Editor').filter(`Author/EMail eq '${userId}'`)();
      items.map((item) => {
        const checkBoxValues: string[] = item.ChoiceFieldCheckbox;
        let checkBoxValuesSelected = "";
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
      console.error(`${this.LOG_SOURCE}:(GetItemsByUser) - ${err.message}`);
    }
    return retVal;
  }

  public async UpdateItem(item: DemoItem): Promise<void> {
    try {
      let checkboxFieldValues: string[] = [];
      if (item.choicefieldcheckbox) {
        checkboxFieldValues = item.choicefieldcheckbox.split(",");
      }
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        Title: item.title,
        MultiLineText: item.multilinetext,
        //Because these are just strings for choice we can 
        //Pass a string
        ChoiceFieldDDL: item.choicefieldddl,
        DateTimeField: item.datetimefield,
        ChoiceFieldRadio: item.choicefieldradio,
        //A multi-select field needs an array passed as the value
        ChoiceFieldCheckbox: checkboxFieldValues,
        NumberField: item.numberfield,
        CurrencyField: item.currencyfield,
        YesNoField: item.yesnofield
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async SaveItem(item: DemoItem): Promise<void> {
    try {
      let checkboxFieldValues: string[] = [];
      if (item.choicefieldcheckbox) {
        checkboxFieldValues = item.choicefieldcheckbox.split(",");
      }
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        Title: item.title,
        MultiLineText: item.multilinetext,
        //Because these are just strings for choice we can 
        //Pass a string
        ChoiceFieldDDL: item.choicefieldddl,
        DateTimeField: item.datetimefield,
        ChoiceFieldRadio: item.choicefieldradio,
        //A multi-select field needs an array passed as the value
        ChoiceFieldCheckbox: checkboxFieldValues,
        NumberField: item.numberfield,
        CurrencyField: item.currencyfield,
        YesNoField: item.yesnofield
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(SaveItem) - ${err.message}`);
    }
  }

  public async DeleteItem(item: DemoItem): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).delete();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
  }

  //This sets up the choice fields. You could extend this for a Lookup field by getting the list/items in a specific list
  //and binding it to a drop down in the adaptive card
  private async _getChoiceFieldValues(fieldName: string): Promise<Choice[]> {
    const retVal: Choice[] = [];
    try {
      const choiceField: any = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string) => {
        retVal.push(new Choice(choice, choice));
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetChoiceFieldValues) - ${err.message}`);
    }
    return retVal;
  }

}
export const SPCRUD = new SPCRUDService();

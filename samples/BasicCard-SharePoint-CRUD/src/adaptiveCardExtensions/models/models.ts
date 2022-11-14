import { ChoiceFieldFormatType } from "@pnp/sp/fields";

export enum Lists {
  DEMOITEMSLIST = "SPCRUDACEExampleList"
}

export interface IDemoItem {
  id: number;
  title: string;
  multilinetext: string;
  choicefieldddl: string;
  choicefieldradio: string;
  choicefieldcheckbox: string;
  numberfield: number;
  currencyfield: string;
  datetimefield: string;
  yesnofield: string;
  modifiedbyid: number;
  modifiedby: string;
  modified: string;

}

export class DemoItem implements IDemoItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public multilinetext: string = "",
    public choicefieldddl: string = "",
    public choicefieldradio: string = "",
    public choicefieldcheckbox: string = "",
    public numberfield: number = 0,
    public currencyfield: string = "",
    public datetimefield: string = "",
    public yesnofield: string = "",
    public modifiedbyid: number = 0,
    public modifiedby: string = "",
    public modified: string = new Date().toLocaleDateString(),
  ) { }
}

export interface IChoice {
  choice: string;
  value: string;
}
export class Choice implements IChoice {
  constructor(
    public choice: string = "",
    public value: string = ""
  ) { }
}

export interface IFieldList {
  name: string;
  props: { FieldTypeKind: number; choices?: string[], richText?: boolean, editFormat?: ChoiceFieldFormatType, minValue?: number, maxValue?: number, localID?: number };
}

export const ListFields: IFieldList[] = [
  { name: "MultiLineText", props: { FieldTypeKind: 3, richText: false } },
  { name: "ChoiceFieldDDL", props: { FieldTypeKind: 6, choices: ["Choice 1", "Choice 2", "Choice 3"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { name: "ChoiceFieldRadio", props: { FieldTypeKind: 6, choices: ["Radio 1", "Radio 2", "Radio 3"], editFormat: ChoiceFieldFormatType.RadioButtons } },
  { name: "ChoiceFieldCheckbox", props: { FieldTypeKind: 15, choices: ["Checkbox 1", "Checkbox 2", "Checkbox 3"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { name: "CurrencyField", props: { FieldTypeKind: 10, minValue: 0, maxValue: 100000, localID: 1033 } },
  { name: "DateTimeField", props: { FieldTypeKind: 4 } },
  { name: "NumberField", props: { FieldTypeKind: 9, minValue: 0, maxValue: 100000 } },
  { name: "YesNoField", props: { FieldTypeKind: 8 } }
];
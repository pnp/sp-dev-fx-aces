export enum Lists {
  DEMOITEMSLIST = "DemoItems"
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
  modifiedby: string;

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
    public modifiedby: string = ""
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
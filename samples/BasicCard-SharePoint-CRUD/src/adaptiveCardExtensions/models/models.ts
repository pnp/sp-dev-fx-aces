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


export interface ISPRawListItem {
  ID: number;
  Title: string;
  Description: string;
  Image: string;
  Link: string;
}

export interface IListItem {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  linkURL: string;
}

export class ListItem implements IListItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public description: string = "",
    public imageURL: string = "",
    public linkURL: string = "",
    
  ) { }
}
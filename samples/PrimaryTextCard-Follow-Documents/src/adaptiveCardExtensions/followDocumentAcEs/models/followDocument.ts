
export interface IFollowDocument {
    id: string;
    fields: Field[];
    WebName: string;
    WebUrl: string;
    Domain: string;
    Folder: string;
    ItemProperties: string;
  }
  
  export class FollowDocument implements IFollowDocument {
    constructor(
      public id: string = "",
      public fields: Field[] = [],
      public WebName: string = "",
      public WebUrl: string = "",
      public Domain: string = "",
      public Folder: string = "",
      public ItemProperties = ""
    ) { }
  }
  
  export interface IField {
    Title: string;
    Url: string;
    SiteId: string;
    WebId: string;
    IconUrl: string;
    ListId: string;
    ItemUniqueId: string;
    ItemId: number;
    Thumbnail: string;
  }
  
  export class Field implements IField {
    constructor(
      public Title: string = "",
      public Url: string = "",
      public SiteId: string = "",
      public WebId: string = "",
      public IconUrl: string = "",
      public ListId: string = "",
      public ItemUniqueId: string = "",
      public ItemId: number = 0,
      public Thumbnail: string = ""
    ) { }
  }
import { PageContext } from "@microsoft/sp-page-context";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields/list";
import "@pnp/sp/views";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import { IView } from "@pnp/sp/views/types";
import { spfi, SPFI, SPFx } from "@pnp/sp";

import { IListAddResult, ILists } from "@pnp/sp/lists";
import {
  DateTimeFieldFormatType,
  CalendarType,
  DateTimeFieldFriendlyFormatType,
  UrlFieldFormatType,
  FieldUserSelectionMode
} from "@pnp/sp/fields/types";

import {
  HelpDeskTicket,
  IFieldList,
  ListNames
} from "../models/helpdesk.models";
import { PermissionKind } from "@pnp/sp/security";
import { IFileAddResult } from "@pnp/sp/files";
import { IItemAddResult } from "@pnp/sp/items";


export interface IHelpDeskServiceService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  Init(serviceScope: ServiceScope): Promise<void>;
  GetHelpDeskTickets: (bingMapsKey: string) => HelpDeskTicket[];
  CloseHelpDeskTickets: (tickets: HelpDeskTicket[], currentTicket: HelpDeskTicket) => HelpDeskTicket[];
  GetLocationData(latitude: string, longitude: string, apiKey: string): Promise<string>;
  GetCurrentLocation(): Promise<any>;
  CheckList(listName: string): Promise<boolean>;
  CanUserUpload(listName: string): Promise<boolean>;
  AddImage(listName: string, fileName: string, fileContents: Uint8Array): Promise<string>;
}

export class HelpDeskService implements IHelpDeskServiceService {
  private LOG_SOURCE = "🔶 Help Desk Service";
  public static readonly serviceKey: ServiceKey<HelpDeskService> =
    ServiceKey.create<HelpDeskService>(
      "HelpDeskService:IHelpDeskServiceService",
      HelpDeskService
    );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _ready = false;
  private _webUrl = "";
  
  public async Init(serviceScope: ServiceScope): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        this._ready = true;
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

  public GetHelpDeskTickets(bingMapsKey: string): HelpDeskTicket[] {
    let retVal: HelpDeskTicket[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your items
      const tickets: HelpDeskTicket[] = require("../data/helpdesk.data.json");

      //We are manipulating the data here to set the due dates so there is always relevant data in the sample.
      //You can remove this code if you are attaching it to a ticketing system
      tickets.map(async (ticket, index) => {
        const newTicket = ticket;
        const eventDate: Date = new Date();
        let offset = 0;
        if (index === 0) {
          offset = 8;
        } else {
          offset = index;
        }
        eventDate.setDate(eventDate.getDate() - offset);
        const monthNumber: number = eventDate.getMonth() + 1;
        let month: string = monthNumber.toString();
        let datestring: string = eventDate.getDate().toString();
        if (monthNumber < 10) {
          month = `0${month}`;
        }
        if (eventDate.getDate() < 10) {
          datestring = `0${datestring}`;
        }
        newTicket.createDate = `${eventDate.getFullYear().toString()}-${month}-${datestring}T00:00:00Z`;

        //Check if it is overdue
        const today: Date = new Date();
        const dueDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        if (eventDate.getTime() < dueDate.getTime()) {
          newTicket.overdue = true;
          const msInDay = 24 * 60 * 60 * 1000;
          const difference = Math.round(Math.abs(Number(dueDate.getTime()) - Number(today.getTime())) / msInDay);
          newTicket.overdueTime = difference.toString();
        } else {
          newTicket.overdue = false;
          newTicket.overdueTime = "";
        }
        //Set the location based on the lat and long in the sample data
        if (bingMapsKey) {
          const location = await this.GetLocationData(ticket.latitude, ticket.longitude, bingMapsKey);
          if (location !== "") {
            newTicket.location = location;
          }
        }
        ticket = newTicket;
      });
      retVal = tickets;

    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (GetHelpDeskTickets) -- getting Help Desk Ticket Data. - ${err}`
      );
    }
    return retVal;
  }

  public CloseHelpDeskTickets(tickets: HelpDeskTicket[], currentTicket: HelpDeskTicket): HelpDeskTicket[] {
    let retVal: HelpDeskTicket[] = [];
    try {

      retVal = tickets.filter(ticket => ticket.incidentNumber != currentTicket.incidentNumber);

    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (CloseHelpDeskTickets) -- closing Help Desk Ticket. - ${err}`
      );
    }
    return retVal;
  }

  public async createList(
    listName: string,
    listDescription: string,
    fieldList: IFieldList[]
  ): Promise<boolean> {
    let retVal = false;
    try {
      const list: IListAddResult = await this._sp.web.lists.add(
        listName,
        `${listName} ${listDescription} List`,
        100,
        false,
        { OnQuickLaunch: true }
      );
      for (let i = 0; i < fieldList.length; i++) {
        if (fieldList[i].props.FieldTypeKind === 2) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addText(fieldList[i].name, { Title: fieldList[i].displayName });
        } else if (fieldList[i].props.FieldTypeKind === 3) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addMultilineText(fieldList[i].name, { Title: fieldList[i].displayName, NumberOfLines: 6, RichText: false, RestrictedMode: false, AppendOnly: false, AllowHyperlink: true });
        } else if (fieldList[i].props.FieldTypeKind === 4) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addDateTime(fieldList[i].name, {
              Title: fieldList[i].displayName,
              DisplayFormat: DateTimeFieldFormatType.DateOnly,
              DateTimeCalendarType: CalendarType.Gregorian,
              FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
            });
        } else if (fieldList[i].props.FieldTypeKind === 6) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addChoice(fieldList[i].name, {
              Title: fieldList[i].displayName,
              Choices: fieldList[i].props.choices!,
            });
        } else if (fieldList[i].props.FieldTypeKind === 11) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addUrl(fieldList[i].name, {
              Title: fieldList[i].displayName,
              DisplayFormat: UrlFieldFormatType.Hyperlink,
            });
        } else if (fieldList[i].props.FieldTypeKind === 12) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addNumber(fieldList[i].name, { Title: fieldList[i].displayName });
        } else if (fieldList[i].props.FieldTypeKind === 20) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addUser(fieldList[i].name, { Title: fieldList[i].displayName, SelectionMode: FieldUserSelectionMode.PeopleOnly });
        } else if (fieldList[i].props.FieldTypeKind === 98) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addImageField(fieldList[i].name, { Title: fieldList[i].displayName });
        }
        else if (fieldList[i].props.FieldTypeKind === 99) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addLocation(fieldList[i].name, { Title: fieldList[i].displayName });
        }
      }
      const view: IView = await this._sp.web.lists.getById(list.data.Id)
        .defaultView;
      for (let i = 0; i < fieldList.length; i++) {
        await view.fields.add(fieldList[i].name);
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(createList) - ${err}`);
    }
    return retVal;
  }

  public async GetLocationData(latitude: string, longitude: string, apiKey: string): Promise<string> {
    let retVal = "";
    try {
      const url = `https://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?includeEntityTypes=Address,Neighborhood,PopulatedPlace&key=${apiKey}`;
      const results: any = await fetch(url).then(res => res.json());

      retVal = results.resourceSets[0].resources[0].address.addressLine;
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (GetLocationData) -- error generating link to BingMaps. - ${err}`
      );
    }
    return retVal;
  }

  public GetCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  public async CheckList(listName: string): Promise<boolean> {
    let retVal = false;
    try {
      const lists: ILists = this._sp.web.lists;
      const list = await lists.filter(`Title eq '${listName}'`)();

      if (list.length > 0) {
        retVal = true;
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (checkList) - ${err}`
      );
    }
    return retVal;
  }
  public async CanUserUpload(listName: string): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.getByTitle(listName);
      retVal = await list.currentUserHasPermissions(PermissionKind.AddListItems);
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (checkList) - ${err}`
      );
    }
    return retVal;
  }

  public async AddImage(listName: string, fileName: string, fileContents: Uint8Array): Promise<string> {
    let retVal: IFileAddResult;
    try {
      const fileNamePath = encodeURI(fileName);
      const assets = await this._sp.web.lists.ensureSiteAssetsLibrary();

      let result: IFileAddResult;
      // you can adjust this number to control what size files are uploaded in chunks
      if (fileContents.length <= 10485760) {
        // small upload
        result = await assets.rootFolder.files.addUsingPath(fileNamePath, fileContents, { Overwrite: true });
      } else {
        // large upload
        //Convert the byteArray to a blob
        const blob = new Blob([fileContents.buffer]);
        result = await assets.rootFolder.files.addChunked(fileNamePath, blob, data => {
          console.log(`image progress ${data.totalBlocks}`);
        }, true);
      }
      if (result) {
        retVal = result;
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (AddImage) - ${err}`
      );
    }

    return JSON.stringify({ "serverRelativeUrl": retVal!.data.ServerRelativeUrl, });
  }

  public async GenerateImageFieldData(ticket: HelpDeskTicket, index: number): Promise<string> {
    let retVal = "";
    try {
      if (ticket.imageNames.length > 0) {
        if (ticket.imageNames.length >= index + 1) {
          retVal = await this.AddImage(ListNames.HELPDESKLIST, ticket.imageNames[index], ticket.imageByteArray[index]);
        }
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (GenerateImageFieldData) - ${err}`
      );
    }

    return retVal;
  }

  public async SaveHelpDeskTicket(listName: string, ticket: HelpDeskTicket): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.getByTitle(listName);
      const currentUser = await this._sp.web.currentUser();
      const addResult: IItemAddResult = await list.items.add({
        Title: ticket.incidentNumber + "_" + ticket.createDate,
        IncidentNumber: ticket.incidentNumber,
        IncidentCreatorId: currentUser.Id,
        IncidentDate: new Date(ticket.createDate),
        IncidentDescription: ticket.description,
        IncidentCategory: ticket.category,
        IncidentUrgency: ticket.urgency,
        IncidentState: ticket.state,
        IncidentImage1: await this.GenerateImageFieldData(ticket, 0),
        IncidentImage2: await this.GenerateImageFieldData(ticket, 1),
        IncidentImage3: await this.GenerateImageFieldData(ticket, 2),
        IncidentLocation: JSON.stringify({
          "DisplayName": ticket.location,
          "Coordinates": {
            "Latitude": ticket.latitude,
            "Longitude": ticket.longitude
          }
        })
      });
      if (addResult) {
        retVal = true;
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (SaveHelpDeskTicket) - ${err}`
      );
    }
    return retVal;
  }
}
export const helpDeskService = new HelpDeskService();
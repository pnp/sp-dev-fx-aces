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
import { spfi, SPFI, SPFx, SPFx as spSPFx } from "@pnp/sp";
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";

import { IList, IListAddResult, ILists } from "@pnp/sp/lists";
import {
  DateTimeFieldFormatType,
  CalendarType,
  DateTimeFieldFriendlyFormatType,
  UrlFieldFormatType,
  FieldUserSelectionMode
} from "@pnp/sp/fields/types";

import {
  DemoUser,
  HelpDeskTicket,
  IFieldList,
  IncidentImage,
  ListNames,
  LocationData
} from "../models/helpdesk.models";
import { PermissionKind } from "@pnp/sp/security";
import { IFileAddResult } from "@pnp/sp/files";
import { IItemAddResult } from "@pnp/sp/items";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";


export interface IHelpDeskServiceService {
  readonly ready: boolean;
  readonly bingMapsAPIKey: string;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  Init(serviceScope: ServiceScope,context: AdaptiveCardExtensionContext): Promise<void>;
  GetHelpDeskTickets(): Promise<HelpDeskTicket[]>;
  CloseHelpDeskTickets: (tickets: HelpDeskTicket[], currentTicket: HelpDeskTicket) => HelpDeskTicket[];
  CreateList(listName: string, listDescription: string, fieldList: IFieldList[]): Promise<boolean>;
  DeleteSampleData(): Promise<boolean>;
  AddSampleData(): Promise<boolean>;
  GetLocationData(latitude: string, longitude: string, apiKey: string): Promise<string>;
  GetCurrentLocation(): Promise<any>;
  CheckList(listName: string): Promise<boolean>;
  CanUserUpload(listName: string): Promise<boolean>;
  AddImage(listName: string, fileName: string, fileContents: Uint8Array): Promise<string>;
  SaveItem: (ticket: HelpDeskTicket) => Promise<boolean>;
  UpdateItem: (ticket: HelpDeskTicket) => Promise<void>;
  DeleteItem: (ticket: HelpDeskTicket) => Promise<void>;
  GenerateImageFieldData(ticket: HelpDeskTicket, index: number): Promise<string>;
}

export class HelpDeskService implements IHelpDeskServiceService {
  private LOG_SOURCE = "🔶 Help Desk Service";
  public static readonly serviceKey: ServiceKey<HelpDeskService> =
    ServiceKey.create<HelpDeskService>(
      "HelpDeskService:IHelpDeskServiceService",
      HelpDeskService
    );
  private _sp: SPFI;
  private _graph: GraphFI;
  private _pageContext: PageContext;
  private _ready = false;
  private _webUrl = "";
  private _bingMapsAPIKey = "";
  
  public async Init(serviceScope: ServiceScope, context: AdaptiveCardExtensionContext): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
        this._graph = graphfi().using(graphSPFx(context));
        this._ready = true;
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (init) - ${err}`);
    }
  }

  public get ready(): boolean {
    return this._ready;
  }
  
  public get bingMapsAPIKey(): string {
    return this._bingMapsAPIKey;
  }
  
  public set bingMapsAPIKey(value: string) {
    this._bingMapsAPIKey = value;
  }

  public get sp(): SPFI {
    return this._sp;
  }
  
  public get graph(): GraphFI {
    return this._graph;
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

  public async GetHelpDeskTickets(): Promise<HelpDeskTicket[]> {
    let retVal: HelpDeskTicket[] = [];
    try {
      //Get the data from the SharePoint list
      const items = await this._sp.web.lists.getByTitle(ListNames.HELPDESKLIST).items.select('Id', 'IncidentNumber', 'IncidentCreator/FirstName', 'IncidentCreator/LastName', 'IncidentCreator/ID', 'IncidentCreator/EMail', 'IncidentDate', 'IncidentDescription', 'IncidentCategory', 'IncidentUrgency', 'IncidentImage1', 'IncidentImage2', 'IncidentImage3', 'IncidentState', 'IncidentLocation', 'Created').expand('IncidentCreator')();
      
      const photoUrl = await this._getUserProfilePhoto();
      items.map((item) => {
        const imageNameArray: string[] = [];
        const location: LocationData = JSON.parse(item.IncidentLocation);
        const image1: IncidentImage = this._getImageData(item.IncidentImage1);
        if (image1) {
          imageNameArray.push(image1.fileName)
        }
        const image2: IncidentImage = this._getImageData(item.IncidentImage2);
        if (image2) {
          imageNameArray.push(image2.fileName)
        }
        const image3: IncidentImage = this._getImageData(item.IncidentImage3);
        if (image3) {
          imageNameArray.push(image3.fileName)
        }
        const today: Date = new Date();
        const dueDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        const incidentDate = new Date(item.incidentDate);
        let overdue = false;
        let overdueTime = "";
        if (incidentDate.getTime() < dueDate.getTime()) {
          overdue = true;
          const msInDay = 24 * 60 * 60 * 1000;
          const difference = Math.round(Math.abs(Number(dueDate.getTime()) - Number(today.getTime())) / msInDay);
          overdueTime = difference.toString();
        }
        return (
          retVal.push(new HelpDeskTicket(
            item.Id,
            item.IncidentNumber,
            new DemoUser(item.IncidentCreator.ID, item.IncidentCreator.FirstName + " " + item.IncidentCreator.LastName, photoUrl),
            item.IncidentDate,
            item.IncidentCategory,
            item.IncidentUrgency,
            item.IncidentState,
            item.IncidentDescription,
            location.DisplayName,
            location.Coordinates.Longitude,
            location.Coordinates.Latitude,
            "",
            overdue,
            overdueTime,
            imageNameArray
          ))
        );
      });
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

  public async CreateList(
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
            .fields.addText(fieldList[i].name);
        } else if (fieldList[i].props.FieldTypeKind === 3) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addMultilineText(fieldList[i].name, { NumberOfLines: 6, RichText: false, RestrictedMode: false, AppendOnly: false, AllowHyperlink: true });
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
              Choices: fieldList[i].props.choices!,
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
        } else if (fieldList[i].props.FieldTypeKind === 20) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addUser(fieldList[i].name, {SelectionMode: FieldUserSelectionMode.PeopleOnly });
        } else if (fieldList[i].props.FieldTypeKind === 98) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addImageField(fieldList[i].name);
        }
        else if (fieldList[i].props.FieldTypeKind === 99) {
          await this._sp.web.lists
            .getById(list.data.Id)
            .fields.addLocation(fieldList[i].name);
        }
        
        await this._sp.web.lists
            .getById(list.data.Id)
            .fields.getByInternalNameOrTitle(fieldList[i].name).update({Title:fieldList[i].displayName});
      }
      const debugList:IList = await this._sp.web.lists.getById(list.data.Id);
      const view: IView = await this._sp.web.lists.getById(list.data.Id).defaultView;
      for (let i = 0; i < fieldList.length; i++) {
        console.log(debugList.fields());
        await view.fields.add(fieldList[i].name);
      }
      this.AddSampleData();
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(createList) - ${err}`);
    }
    return retVal;
  }
  
  public async DeleteSampleData(): Promise<boolean> {
    let retVal = false;
    try {
      const tickets = await this.GetHelpDeskTickets();
      tickets.map(async (ticket) => {
        await this.DeleteItem(ticket);
      })
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(deleteSampleData) - ${err}`);
    }
    return retVal;
  }
  
  public async AddSampleData(): Promise<boolean>  {
    let retVal = false;
    try {
      const tickets: HelpDeskTicket[] = this.getMockData();
      tickets.map(async (ticket, index) => {
        await this.SaveItem(ticket);
      });
      retVal = true;
    
    }catch(err){
      console.error(`${this.LOG_SOURCE} (addSampleData) - ${err}`);
    }
    return retVal
  }
  
  private getMockData(): HelpDeskTicket[]{
    let retVal: HelpDeskTicket[] = [];
    try {
      //Get the Mock Data from the JSON file
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
        if (this._bingMapsAPIKey) {
          const location = await this.GetLocationData(ticket.latitude, ticket.longitude, this._bingMapsAPIKey);
          if (location !== "") {
            newTicket.location = location;
          }
        }
        ticket = newTicket;
      });
      retVal = tickets;
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (getMockData) -- getting getMockData Help Desk Ticket Data. - ${err}`
      );
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
  
  private async _getUserProfilePhoto(): Promise<string> {
    let retVal = "";
    try{
      const photoBlob = await this._graph.me.photo.getBlob();
      if (photoBlob) {
        const url = window.URL || window.webkitURL;
        const photoUrl = url.createObjectURL(photoBlob);
        retVal = photoUrl;
      }
    }catch(err){
      console.error(`${this.LOG_SOURCE} (_getUserProfilePhoto) - ${err}`);
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
  
  public async SaveItem(ticket: HelpDeskTicket): Promise<boolean> {
    let retVal = false;
    try {
      
      const list = await this._sp.web.lists.getByTitle(ListNames.HELPDESKLIST);
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
        IncidentImage1 : (ticket.imageNames.length > 0)? await this.GenerateImageFieldData(ticket, 0): "",
        IncidentImage2 : (ticket.imageNames.length >= 1)? await this.GenerateImageFieldData(ticket, 1): "",
        IncidentImage3 : (ticket.imageNames.length >= 2)? await this.GenerateImageFieldData(ticket, 2): "",
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
      console.error(`${this.LOG_SOURCE}:(SaveItem) - ${err.message}`);
    }
    return retVal;
  }
  
  private _getImageData(imageData: string): IncidentImage{
    let retVal: IncidentImage = new IncidentImage();
    try {
      if (imageData) {
        const imgData: IncidentImage = JSON.parse(imageData);
        imgData.fileName = imgData.serverRelativeUrl.substring(imgData.serverRelativeUrl.lastIndexOf("/")+1);
        
        if (imgData) {
          retVal = imgData
        }
      }
    }catch(err){
      console.error(`${this.LOG_SOURCE} (_getImageData) - ${err}`);
    }
    return retVal;
  }
  
  public async UpdateItem(ticket: HelpDeskTicket): Promise<void> {
    try {
      const currentUser = await this._sp.web.currentUser();
      await this._sp.web.lists.getByTitle(ListNames.HELPDESKLIST).items.getById(ticket.id).update({
        Title: ticket.incidentNumber + "_" + ticket.createDate,
        IncidentNumber: ticket.incidentNumber,
        IncidentCreatorId: currentUser.Id,
        IncidentDate: new Date(ticket.createDate),
        IncidentDescription: ticket.description,
        IncidentCategory: ticket.category,
        IncidentUrgency: ticket.urgency,
        IncidentState: ticket.state,
        IncidentImage1 : (ticket.imageNames.length > 0)? await this.GenerateImageFieldData(ticket, 0): "",
        IncidentImage2 : (ticket.imageNames.length >= 1)? await this.GenerateImageFieldData(ticket, 1): "",
        IncidentImage3 : (ticket.imageNames.length >= 2)? await this.GenerateImageFieldData(ticket, 2): "",
        IncidentLocation: JSON.stringify({
          "DisplayName": ticket.location,
          "Coordinates": {
            "Latitude": ticket.latitude,
            "Longitude": ticket.longitude
          }
        })
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async DeleteItem(ticket: HelpDeskTicket): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(ListNames.HELPDESKLIST).items.getById(ticket.id).delete();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
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
}
export const helpDeskService = new HelpDeskService();
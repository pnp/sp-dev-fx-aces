export enum ListNames {
  HELPDESKLIST = "Help Desk Tickets",
}

export interface IHelpDeskTicket {
  incidentNumber: string;
  requestedBy: DemoUser;
  createDate: string;
  category: string;
  urgency: string;
  state: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  requestType?: string;
  overdue?: boolean;
  overdueTime?: string;
  imageNames?: string[];
  imageByteArray?: Uint8Array[];
}

export interface IDemoUser {
  id: string;
  displayName: string;
  imageUrl: string;
}

export class DemoUser implements IDemoUser {
  constructor(
    public id: string = "",
    public displayName: string = "",
    public imageUrl: string = ""
  ) { }
}

export class HelpDeskTicket implements IHelpDeskTicket {
  constructor(
    public incidentNumber: string = "",
    public requestedBy: DemoUser = new DemoUser(),
    public createDate: string = "",
    public category: string = "",
    public urgency: string = "",
    public state: string = "New",
    public description: string = "",
    public location: string = "",
    public latitude: string = "",
    public longitude: string = "",
    public requestType: string = "",
    public overdue: boolean = false,
    public overdueTime: string = "",
    public imageNames: string[] = [],
    public imageByteArray: Uint8Array[] = []
  ) { }
}

export interface IFieldList {
  name: string;
  displayName: string;
  props: { FieldTypeKind: number; choices?: string[] };
}

export const HelpDeskLibraryFields: IFieldList[] = [
  { name: "IncidentNumber", displayName: "Incident Number", props: { FieldTypeKind: 2 } },
  { name: "IncidentCreator", displayName: "Creator", props: { FieldTypeKind: 20 } },
  { name: "IncidentDate", displayName: "Incident Date", props: { FieldTypeKind: 4 } },
  { name: "IncidentDescription", displayName: "Incident Description", props: { FieldTypeKind: 3 } },
  { name: "IncidentCategory", displayName: "Category", props: { FieldTypeKind: 6, choices: ["IT Request", "Incident Reporting"] } },
  { name: "IncidentUrgency", displayName: "Urgency", props: { FieldTypeKind: 6, choices: ["Low", "Medium", "High"] } },
  { name: "IncidentImage1", displayName: "Image 1", props: { FieldTypeKind: 98 } },
  { name: "IncidentImage2", displayName: "Image 2", props: { FieldTypeKind: 98 } },
  { name: "IncidentImage3", displayName: "Image 3", props: { FieldTypeKind: 98 } },
  { name: "IncidentState", displayName: "State", props: { FieldTypeKind: 6, choices: ["New"] } },
  { name: "IncidentLocation", displayName: "Location", props: { FieldTypeKind: 99 } },

];
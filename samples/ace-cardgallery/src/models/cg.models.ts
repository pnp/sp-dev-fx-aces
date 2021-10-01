export interface ILocation {
  id: number;
  displayName: string;
  city: string;
  state: string;
  country: string;
  date: string;
  tempCurrent: number;
  tempHi: number;
  tempLow: number;
  tempMeasure: string;
}

export class Location implements ILocation {
  constructor(
    public id: number,
    public displayName: string = "",
    public city: string = "",
    public state: string = "",
    public country: string = "",
    public date: string = "",
    public tempCurrent: 0,
    public tempHi: 0,
    public tempLow: 0,
    public tempMeasure: string = ""
  ) { }
}

export interface IImage {
  id: number;
  sortOrder: number;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
}

export class Image implements IImage {
  constructor(
    public id: number = 0,
    public sortOrder: number = 0,
    public imageSrc: string = "",
    public altText: string = "",
    public title: string = "",
    public description: string = "",
  ) { }
}

export interface IArticle {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
  url: string;
  liked: boolean;
}

export class Article implements IArticle {
  constructor(
    public id: number = 0,
    public title: string = "",
    public description: string = "",
    public imageSrc: string = "",
    public altText: string = "",
    public url: string = "",
    public liked: boolean = false,
  ) { }
}

export interface ITweet {
  id: number;
  date: string;
  userAccount: string;
  userDisplayName: string;
  userPhoto: string;
  imageSrc: string;
  text: string;
  linkUrl: string;
  tweetUrl: string;
  liked: boolean;
}
export class Tweet implements ITweet {
  constructor(
    public id: number = 0,
    public date: string = "",
    public userAccount: string = "",
    public userDisplayName: string = "",
    public userPhoto: string = "",
    public imageSrc: string = "",
    public text: string = "",
    public linkUrl: string = "",
    public tweetUrl: string = "",
    public liked: boolean = false,
  ) { }
}

export interface ITask {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
}

export class Task implements ITask {
  constructor(
    public id: number = 0,
    public title: string = "",
    public assignedTo: string = "",
    public dueDate: string = "",
  ) { }
}

export interface ITaskList {
  userName: string;
  userPhoto: string;
  tasks: Task[];
}

export class TaskList implements ITaskList {
  constructor(
    public userName: string = "",
    public userPhoto: string = "",
    public tasks: Task[] = [],
  ) { }
}

export interface IStock {
  id: number;
  symbol: string;
  companyName: string;
  primaryExchange: string;
  latestUpdate: string;
  latestPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
}

export class Stock implements IStock {
  constructor(
    public id: number = 0,
    public symbol: string = "",
    public companyName: string = "",
    public primaryExchange: string = "",
    public latestUpdate: string = "",
    public latestPrice: number = 0,
    public change: number = 0,
    public changePercent: number = 0,
    public open: number = 0,
    public high: number = 0,
    public low: number = 0,
  ) { }

}
export interface IExpense {
  id: number;
  expenseId: string;
  createdTime: string;
  description: string;
  currencyCode: string;
  isReimbursable: boolean;
  total: number;
  createdBy: string;
  customFields: IExpenseField[];
}

export class Expense implements IExpense {
  constructor(
    public id: number = 0,
    public expenseId: string = "",
    public createdTime: string = "",
    public description: string = "",
    public currencyCode: string = "",
    public isReimbursable: boolean = false,
    public total: number = 0,
    public createdBy: string = "",
    public customFields: IExpenseField[] = []
  ) { }
}

export interface IExpenseField {
  id: number;
  label: string;
  value: string;
}

export class ExpenseField implements IExpenseField {
  constructor(
    public id: number = 0,
    public label: string = "",
    public value: string = "",
  ) { }
}

export interface IExpenseReport {
  id: number;
  code: string;
  message: string;
  createdByName: string;
  createdDate: string;
  submittedDate: string;
  createrEmail: string;
  status: string;
  statusUrl: string;
  approver: string;
  purpose: string;
  approvalDate: string;
  approverEmail: string;
  otherSubmitter: string;
  otherSubmitterEmail: string;
  expenses: Expense[];
}

export class ExpenseReport implements IExpenseReport {
  constructor(
    public id: number = 0,
    public code: string = "",
    public message: string = "",
    public createdByName: string = "",
    public createdDate: string = "",
    public submittedDate: string = "",
    public createrEmail: string = "",
    public status: string = "",
    public statusUrl: string = "",
    public approver: string = "",
    public purpose: string = "",
    public approvalDate: string = "",
    public approverEmail: string = "",
    public otherSubmitter: string = "",
    public otherSubmitterEmail: string = "",
    public expenses: Expense[] = []
  ) { }
}

export interface IFormSample {
  participantInfoForm: ParticipantInfoForm;
  survey: Survey;

}
export class FormSample implements IFormSample {
  constructor(
    public participantInfoForm: ParticipantInfoForm = new ParticipantInfoForm(),
    public survey: Survey = new Survey()
  ) { }
}
export interface IParticipantInfoForm {
  title: string;
}
export class ParticipantInfoForm implements IParticipantInfoForm {
  constructor(
    public title: string = ""
  ) { }
}
export interface ISurvey {
  title: string;
  questions: SurveyQuestion[];
}
export class Survey implements ISurvey {
  constructor(
    public title: string = "",
    public questions: SurveyQuestion[] = []
  ) { }
}
export interface ISurveyQuestion {
  question: string;
  items: Choice[];
}
export class SurveyQuestion implements ISurveyQuestion {
  constructor(
    public question: string = "",
    public items: Choice[] = []
  ) { }
}
export interface IChoice {
  choice: string;
  value: string;
}
export class Choice implements IChoice {
  constructor(
    public choice: string = "",
    public value: string = "",
  ) { }
}

export interface IVideo {
  id: number;
  title: string;
  thumbnailUrl: string;
  url: string;
  description: string;
  moreLinkText: string;
  moreLink: string;
}

export class Video implements IVideo {
  constructor(
    public id: number = 0,
    public title: string = "",
    public thumbnailUrl: string = "",
    public url: string = "",
    public description: string = "",
    public moreLinkText: string = "",
    public moreLink: string = ""
  ) { }
}

export interface IReservation {
  id: number;
  reservationId: string;
  flightNumber: string;
  provider: string;
  departureTime: string;
  arrivalTime: string;
  link: string;
  passengers: Person[];
  departureAirport: City;
  arrivalAirport: City;
}
export class Reservation implements IReservation {
  constructor(
    public id: number = 0,
    public reservationId: string = "",
    public flightNumber: string = "",
    public provider: string = "",
    public departureTime: string = "",
    public arrivalTime: string = "",
    public link: string = "",
    public passengers: Person[] = [],
    public departureAirport: City = new City(),
    public arrivalAirport: City = new City()
  ) { }
}
export interface IPerson {
  id: number;
  firstName: string;
  lastName: string;
}
export class Person implements IPerson {
  constructor(
    public id: number = 0,
    public firstName: string = "",
    public lastName: string = ""
  ) { }
}
export interface ICity {
  id: number;
  city: string;
  iataCode: string;
  image: string;
}
export class City implements ICity {
  constructor(
    public id: number = 0,
    public city: string = "",
    public iataCode: string = "",
    public image: string = ""
  ) { }
}

export interface IAgenda {
  id: number;
  subject: string;
  location: string;
}

export class Agenda implements IAgenda {
  constructor(
    public id: number = 0,
    public subject: string = "",
    public location: string = ""
  ) { }
}


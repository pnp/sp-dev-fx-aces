import { Logger, LogLevel } from "@pnp/logging";
import { Article, ExpenseReport, FormSample, Location, Image, IVideo, Reservation, Stock, TaskList, Tweet, Video, Agenda } from "../models/cg.models";


export interface ICardGalleryService {
  Ready: boolean;
  HandleExecuteDeepLink: (meetingUrl: string) => void;
  Init(): void;
  ExecuteDeepLink(meetingUrl: string): void;
  GetLocations(): Promise<Location[]>;
  GetImages(): Promise<Image[]>;
  GetArticles(): Promise<Article[]>;
  GetTweets(): Promise<Tweet[]>;
  GetTasks(): Promise<TaskList>;
  GetStocks(): Promise<Stock>;
  GetExpenseReports(): Promise<ExpenseReport[]>;
  GetFormSample(): Promise<FormSample>;
  GetVideos(): Promise<Video[]>;
  GetFlightItineraries(): Promise<Reservation[]>;
  GetAgendas(): Promise<Agenda[]>;
}

export class CardGalleryService implements ICardGalleryService {
  private LOG_SOURCE: string = "🔶 CardGalleryService";
  private _ready: boolean = false;
  private _siteUrl!: string;
  private _executeDeepLink!: (meetingUrl: string) => void;

  constructor() {
  }

  public get Ready(): boolean {
    return this._ready;
  }
  public set HandleExecuteDeepLink(value: (meetingUrl: string) => void) {
    this._executeDeepLink = value;
  }

  public Init() {
    try {
      this._ready = true;
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  public async GetLocations(): Promise<Location[]> {
    let retVal: Location[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your locations
      retVal = (await import(/* webpackChunkName: "mock-locations" */ "../mocks/locationsConfig.json")).default as unknown as Location[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetLocations) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async GetImages(): Promise<Image[]> {
    let retVal: Image[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-imagerotator" */ "../mocks/imageRotatorConfig.json")).default as unknown as Image[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetImages) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async GetArticles(): Promise<Article[]> {
    let retVal: Article[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-companynews" */ "../mocks/companyNewsConfig.json")).default as unknown as Article[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetArticles) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async GetTweets(): Promise<Tweet[]> {
    let retVal: Tweet[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-twitter" */ "../mocks/twitterCardConfig.json")).default as unknown as Tweet[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetTweets) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async GetTasks(): Promise<TaskList> {
    let retVal: TaskList = new TaskList();
    try {
      retVal = (await import(/* webpackChunkName: "mock-tasklist" */ "../mocks/taskListConfig.json")).default as unknown as TaskList;
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetTasks) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async GetStocks(): Promise<Stock> {
    let retVal: Stock = new Stock();
    try {
      retVal = (await import(/* webpackChunkName: "mock-stock" */ "../mocks/stockTickerConfig.json")).default as unknown as Stock;
      retVal.latestUpdate = (new Date().toUTCString());
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetStocks) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async GetExpenseReports(): Promise<ExpenseReport[]> {
    let retVal: ExpenseReport[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-expensereport" */ "../mocks/expenseReportConfig.json")).default as unknown as ExpenseReport[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetExpenseReports) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async GetFormSample(): Promise<FormSample> {
    let retVal: FormSample = null as unknown as FormSample;
    try {
      retVal = (await import(/* webpackChunkName: "mock-formsample" */ "../mocks/formSampleConfig.json")).default as unknown as FormSample;
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetFormSample) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async GetVideos(): Promise<IVideo[]> {
    let retVal: Video[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-video" */ "../mocks/videoCardConfig.json")).default as unknown as Video[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetVideos) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async GetFlightItineraries(): Promise<Reservation[]> {
    let retVal: Reservation[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-flight" */ "../mocks/filghtItineraryConfig.json")).default as unknown as Reservation[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetFlightItineraries) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public async GetAgendas(): Promise<Agenda[]> {
    let retVal: Agenda[] = [];
    try {
      retVal = (await import(/* webpackChunkName: "mock-agenda" */ "../mocks/agendaConfig.json")).default as unknown as Agenda[];
    } catch (err: any) {
      Logger.write(`${this.LOG_SOURCE} (GetAgendas) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public ExecuteDeepLink(meetingUrl: string): void {
    if (typeof this._executeDeepLink == "function") {
      this._executeDeepLink(meetingUrl);
    }
  }

}

export const cg = new CardGalleryService();
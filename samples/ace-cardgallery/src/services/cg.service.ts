import { Logger, LogLevel } from "@pnp/logging";
import { Article, ExpenseReport, FormSample, Location, Image, IVideo, Reservation, Stock, TaskList, Tweet, Video, Agenda } from "../models/cg.models";


export interface ICardGalleryService {
  Ready: boolean;
  HandleExecuteDeepLink: (meetingUrl: string) => void;
  Init(): void;
  ExecuteDeepLink(meetingUrl: string);
  GetLocations(): Location[];
  GetImages(): Image[];
  GetArticles(): Article[];
  GetTweets(): Tweet[];
  GetTasks(): TaskList;
  GetStocks(): Stock;
  GetExpenseReports(): ExpenseReport[];
  GetFormSample(): FormSample;
  GetVideos(): Video[];
  GetFlightItineraries(): Reservation[];
  GetAgendas(): Agenda[];
}

export class CardGalleryService implements ICardGalleryService {
  private LOG_SOURCE: string = "🔶 CardGalleryService";
  private _ready: boolean = false;
  private _siteUrl: string;
  private _executeDeepLink: (meetingUrl: string) => void;

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
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  public GetLocations(): Location[] {
    let retVal: Location[] = [];
    try {
      //Sample pulls data from mock
      //To extend pull data from a list of your locations
      retVal = require("../mocks/locationsConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetLocations) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetImages(): Image[] {
    let retVal: Image[] = [];
    try {
      retVal = require("../mocks/imageRotatorConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetImages) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public GetArticles(): Article[] {
    let retVal: Article[] = [];
    try {
      retVal = require("../mocks/companyNewsConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetArticles) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public GetTweets(): Tweet[] {
    let retVal: Tweet[] = [];
    try {
      retVal = require("../mocks/twitterCardConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetTweets) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public GetTasks(): TaskList {
    let retVal: TaskList = new TaskList();
    try {
      retVal = require("../mocks/taskListConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetTasks) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public GetStocks(): Stock {
    let retVal: Stock = new Stock();
    try {
      retVal = require("../mocks/stockTickerConfig.json");
      retVal.latestUpdate = (new Date().toUTCString());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetStocks) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public GetExpenseReports(): ExpenseReport[] {
    let retVal: ExpenseReport[] = [];
    try {
      retVal = require("../mocks/expenseReportConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetExpenseReports) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetFormSample(): FormSample {
    let retVal: FormSample = null;
    try {
      retVal = require("../mocks/formSampleConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetFormSample) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetVideos(): IVideo[] {
    let retVal: Video[] = [];
    try {
      retVal = require("../mocks/videoCardConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetVideos) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetFlightItineraries(): Reservation[] {
    let retVal: Reservation[] = [];
    try {
      retVal = require("../mocks/filghtItineraryConfig.json");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetFlightItineraries) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

  public GetAgendas(): Agenda[] {
    let retVal: Agenda[] = [];
    try {
      retVal = require("../mocks/agendaConfig.json");
    } catch (err) {
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
import { Logger, LogLevel } from "@pnp/logging";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { ISPFXContext } from "@pnp/common";
import { ILunch, ILunches, Lunch, Weekday } from "../models/ILunch";
import { IRenderListDataParameters } from "@pnp/sp/lists";

export interface ITodaysLunchService {
  init(context: ISPFXContext): void;
  getTodaysLunch(): Promise<ILunches>;
}

export class TodaysLunchService implements ITodaysLunchService {
  private LOG_SOURCE: string = "🔶 TodaysLunchService";

  public init(context: ISPFXContext): void {
    try {
      sp.setup({ spfxContext: context });
    } catch (err) {
      Logger.write(
        `${this.LOG_SOURCE} (init) - ${err.message}`,
        LogLevel.Error
      );
    }
  }

  public async getTodaysLunch(): Promise<ILunches> {
    try {
        const renderListDataParams: IRenderListDataParameters = {
            //ViewXml: "<View><RowLimit>1</RowLimit></View>",
            ViewXml: "<View></View>", 
        };

        const query = new Map<string, string>();
        query.set("FilterType1", "Choice");
        query.set("FilterField1", "WeekDay");
        query.set("FilterValue1", this._getTodayWeekday().toString());
        
        const data = await sp.web.lists.getByTitle('todayslunch').renderListDataAsStream(renderListDataParams, null, query);
        const rows = data.Row;
        let iLunchs: ILunches = { 
          lunches: []
        };
        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];
          const picture = `${row.LunchPicture.serverUrl}${row.LunchPicture.serverRelativeUrl}`; 
          const hasVegan: boolean = row['HasVeganDishes.value'] == '1';
          const lunch = new Lunch(row.ID, row.Title, row.ShortDescription, row.SeeMore, row.Dishes, row.Weekday, hasVegan, picture, row.Calories);
          iLunchs.lunches.push(lunch);
        }
        Logger.write(`${this.LOG_SOURCE} (onAction) - ${iLunchs} - ${iLunchs.lunches}`, LogLevel.Info);
        return iLunchs;
    } catch (err) {
      Logger.write(
        `${this.LOG_SOURCE} (init) - ${err.message}`,
        LogLevel.Error
      );
    }
  }

  private _getTodayWeekday(): Weekday {
    switch (new Date().getDay()) {
      case 0:
        return Weekday.Sunday;
      case 1:
        return Weekday.Monday;
      case 2:
        return Weekday.Tuesday;
      case 3:
        return Weekday.Wednesday;
      case 4:
        return Weekday.Thursday;
      case 5:
        return Weekday.Friday;
      case 6:
        return Weekday.Saturday;
    }
  }
}

export const todaysLunchService = new TodaysLunchService();
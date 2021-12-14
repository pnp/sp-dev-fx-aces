import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from "@microsoft/sp-adaptive-card-extension-base";
import {
  ICovidIndicatorAdaptiveCardExtensionProps,
  ICovidIndicatorAdaptiveCardExtensionState,
} from "../../adaptiveCardExtensions/covidIndicator/CovidIndicatorAdaptiveCardExtension";
import { quickView } from "../../templates/QuickViewTemplate";
import { utils } from "../../util";
interface ICases {
  new: string;
  active: string;
  critical: string;
  recovered: string;
  "1M_pop": string;
  total: string;
}
interface IDeaths {
  new: string;
  "1M_pop": string;
  total: string;
}

export interface ITests {
  "1M_pop": string;
  total: string;
}

export interface IQuickViewData {
  continent: string;
  country: string;
  population: string;
  cases: ICases;
  deaths: IDeaths;
  tests: ITests;
  flag: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ICovidIndicatorAdaptiveCardExtensionProps,
  ICovidIndicatorAdaptiveCardExtensionState,
  IQuickViewData
> {
  private getFlag = utils().getFlag;
  public get data(): IQuickViewData {
    const countryData = this.state.countryInfo[0];

    const mapData: IQuickViewData = {
      country: countryData.country.toUpperCase(),
      continent: countryData.continent,
      population: countryData.population.toLocaleString(),
      cases: {
        ...countryData.cases,
        new: countryData.cases?.new ? countryData.cases?.new : "N/A",
        active: countryData.cases.active.toLocaleString(),
        "1M_pop": Number(countryData.cases["1M_pop"]).toLocaleString(),
        critical: countryData.cases.critical.toLocaleString(),
        recovered: countryData.cases.recovered.toLocaleString(),
        total: countryData.cases.total.toLocaleString(),
      },
      deaths: {
        ...countryData.deaths,
        new: countryData.deaths?.new ? countryData.deaths?.new : "N/A",
        "1M_pop": Number(countryData.deaths["1M_pop"]).toLocaleString(),
        total: countryData.deaths.total.toLocaleString(),
      },
      tests: {
        ...countryData.tests,
        "1M_pop": Number(countryData.tests["1M_pop"]).toLocaleString(),
        total: countryData.tests.total.toLocaleString(),
      },
      flag: this.getFlag(countryData, "medium"),
    };
    return {
      ...mapData,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return quickView as ISPFxAdaptiveCard;
  }
}

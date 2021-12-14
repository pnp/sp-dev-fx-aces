import { IAPIResults } from "../models/IAPIResults";
const coutriesCodes: ICountry[] = require("./../data/countries.json");
import { isEmpty, find } from "@microsoft/sp-lodash-subset";
import { ICountry } from "../data/ICountries";
export const utils = () => {
  const getFlag = (contryInfo: IAPIResults, size: "small" | "medium"): string => {
    if (isEmpty(contryInfo)) return undefined;
    const { country } = contryInfo;
    let flag = "";
    let searchCountry = country;
    if (country === "UK") {
      searchCountry = "United Kingdom of Great Britain and Northern Ireland";
    }
    if (country === "Russia") {
      searchCountry = "Russian Federation";
    }
    if (country === "USA") {
      searchCountry = "United States of America";
    }

    const countryAllInfo = find(coutriesCodes, ["name", searchCountry]);
    console.log(countryAllInfo);
    if (countryAllInfo) {
      const contryCode2Dig = (countryAllInfo["alpha-2"] as string).toLowerCase();
      flag =
        size === "small"
          ? `https://flagcdn.com/w40/${contryCode2Dig}.png`
          : `https://flagcdn.com/w80/${contryCode2Dig}.png`;
    }

    return flag;
  };

  return { getFlag };
};

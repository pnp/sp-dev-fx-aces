import { IAPIResults } from "../models/IAPIResults";
const coutriesCodes: ICountry[] = require("./../data/countries.json");
import { isEmpty, find } from "@microsoft/sp-lodash-subset";
import { ICountry } from "../data/ICountries";
export const utils = () => {
  const getFlag = (contryInfo: IAPIResults, size: "small" | "medium"): string => {
  if  (isEmpty(contryInfo)) return undefined;
    const { country } = contryInfo;
    let flag = "";
    const countryAllInfo =  coutriesCodes.filter((ct:ICountry) => {
       if (country === 'UK' && ct["alpha-2"] === "GB" ){
          return ct ;
       }
       if (country === 'Russia' && ct["alpha-2"] === "RU" ){
        return ct ;
     }
       if (country === 'USA' && ct["alpha-3"] === "USA" ){
        return ct  ;
      }
      if( ct.name === country){
        return ct;
      }else{
        return [];
      }
    });
    if (countryAllInfo.length){
      const contryCode2Dig = (countryAllInfo[0]["alpha-2"] as string).toLowerCase();
      flag =
        size === "small"
          ? `https://flagcdn.com/w40/${contryCode2Dig}.png`
          : `https://flagcdn.com/w80/${contryCode2Dig}.png`;
    }

    return flag;
  };

  return { getFlag };
};

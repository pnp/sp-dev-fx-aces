import {  isEmpty } from '@microsoft/sp-lodash-subset';
import {HttpClient,HttpClientResponse} from '@microsoft/sp-http';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import  moment from 'moment';
import { Constants } from './Constants';
import { sp } from '@pnp/sp/presets/all';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';


let HOLIDAY_API_URL: string = "https://calendarific.com/api/v2/holidays?api_key=eb7a99eaf99303ed521768a508e3caebadb33457&country={0}&year=2023";

 class CommonService{
    

    public getHolidayList=async (context:BaseComponentContext,countryCode:string):Promise<any>=>{        
        const response:HttpClientResponse=await context.httpClient.get(HOLIDAY_API_URL.replace('{0}',countryCode),HttpClient.configurations.v1);
        const data=await response.json();
        const holidayList=data.response;

        if(!isEmpty(holidayList)){     
          let nextHoliday:any;
          const holidayCalArr:any=[];
          holidayList.holidays.map((dateElement:any) => {
            let diff = moment(dateElement.date.iso).diff(moment(), 'days');
            if (diff > 0) {
              if (nextHoliday) {
                if (moment(dateElement).diff(moment(nextHoliday), 'days') < 0) {
                  nextHoliday = dateElement;
                }
                holidayCalArr.push(dateElement);
              } else {
                nextHoliday = dateElement;
              }
            }
          });
          console.log(holidayCalArr);
          return {nextHoliday,holidayCalArr};
        }
    
      }


      public getConfigList=async(emailId:string):Promise<any>=>{
        try
        {
          const configItem=await sp.web.lists.getByTitle(Constants.CONFIG_LIST_NAME).items
          .filter(`Title eq '${Constants.CONFIG_KEY}' and Email eq '${emailId}'`)
          .get();
  
          const configRes=!isEmpty(configItem)?configItem:null;
          return configRes;
        }
        catch(err){
          console.log(err);
          return null;
        }
       
      }

      public  addItemToList=async(leaveInfo:any,authorInfo:ISiteUserInfo):Promise<any>=>{
       return sp.web.lists.getByTitle(Constants.LEAVETRACKER_LIST_NAME).items.add({
          Title: leaveInfo.leaveType,
          StartDate: leaveInfo.startDate,
          EndDate:leaveInfo.endDate,
          LeaveType:leaveInfo.leaveType,
          LeaveDescription:leaveInfo.leaveDescription,
          AppliedById: authorInfo.Id           
          });
      }

}

let commonAction=new CommonService();
export default commonAction;


import { BaseComponentContext } from '@microsoft/sp-component-base';



export interface IGraphHelper{
    Init_GraphClient():Promise<void>;
}


 export class GraphService implements IGraphHelper{

    private _context: BaseComponentContext = undefined;
    private _msGraphClient :any = undefined;

    

    constructor(context?: BaseComponentContext) {
        this._context = context;
    }

    public Init_GraphClient = async ():Promise<any> => {
        return await this._context.msGraphClientFactory.getClient("3");
    }

    public SetOutOfOffice= async (startDate:Date,endDate:Date,offMessage:string): Promise<any> => {
        try{        
         
          this._msGraphClient= await this.Init_GraphClient();
           //'@odata.context': 'https://graph.microsoft.com/beta/$metadata#Me/mailboxSettings',
          const mailboxSettings = {           
            automaticRepliesSetting: {
                status: 'Scheduled',
                externalAudience: "all",
                scheduledStartDateTime: {
                  dateTime: `${startDate}T00:01:00.0000000`,
                  
                },
                scheduledEndDateTime: {
                  dateTime: `${endDate}T23:59:00.0000000`,
                 
                },
                internalReplyMessage: `<html>\n<body>\n<p>${offMessage} <br>\n</p></body>\n</html>\n`,
                externalReplyMessage: `<html>\n<body>\n<p>${offMessage} <br>\n</p></body>\n</html>\n`
            }
        };

         await this._msGraphClient.api("/me/mailboxSettings")
                              .version("beta")
                              .update(mailboxSettings); 
         return true;
        }
        catch(err){
           console.log("Exception occurred "+err);
           return false;
        }
    }
      
    public async GetGraphData(apiName:string,version:string):Promise<any>{
      try
      {
        this._msGraphClient= await this.Init_GraphClient();
        const graphRes= await this._msGraphClient.api(apiName)
                           .version(version)
                           .get();
        return graphRes;
      }
      catch(err){
        console.log("Exception err");
      }
    }
     
}


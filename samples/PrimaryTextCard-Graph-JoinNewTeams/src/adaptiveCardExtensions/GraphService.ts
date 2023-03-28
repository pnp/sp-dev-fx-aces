import { MSGraphClient } from "@microsoft/sp-http";
import { Team } from './types';


export interface IGraphService {
  GetTeams(): Promise<void>;
}


class GraphService implements IGraphService {
  public context:any = null;
  private graphClient: MSGraphClient;

  constructor() {

  }
  public async GetTeams(): Promise<any> {
    let teams: any = await this.GET("groups", true, "resourceProvisioningOptions/Any(x:x eq 'Team')", "displayName,id,description,visibility,createdDateTime",100);
    return teams;
  }

  public async GetUserTeams(userId: string): Promise<any> {
    const teams: any = await this.GET("users/" + userId + "/joinedTeams", false, "", "id");
    return teams;
  }

  public async GetUserId(userEmail: string): Promise<any> {
    const userId = this.GET("users", false, "proxyAddresses/Any(r:r eq 'SMTP:" + userEmail + "')", "id");
    return userId;
  }


  public async GetProfilePicture(groupId:any): Promise<any> {
    let photo: any = await this.GETPICTURE("/groups/" + groupId + "/photo/$value");
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(photo)));

    return base64String;
  }

  private POST(api: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.getClient().then((client: MSGraphClient): void => {
        client.api(api).version("beta")
          .post(body, (error, response) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(response);
          });
      });
    });
  }


  private GET(api: string, count: boolean, filter?: string, select?: string, top?: number, responseType?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (count) {
        return this.getClient().then((client: MSGraphClient): void => {
          client.api(api).version("v1.0").select(select).count(true).header("ConsistencyLevel", "eventual").filter(filter).top(top).responseType(responseType)
            .get((error, response) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(response);
            });
        });
      } else {
        return this.getClient().then((client: MSGraphClient): void => {
          client.api(api).version("v1.0").select(select).filter(filter).responseType(responseType)
            .get((error, response) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(response);
            });
        });
      }

    });
  }

  private GETPICTURE(api: string, responseType?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.getClient().then((client: MSGraphClient): void => {
        client.api(api).version("beta").responseType('arraybuffer')
          .get((error, response) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(response);
          });
      });
    });
  }


  private getClient(): Promise<MSGraphClient> {
    if (!this.graphClient) {
      return this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          this.graphClient = client;
          return client;
        })
        .catch((error: Error) => {
          console.error('Error getting the Graph client', error);
          throw error;
        });
    }
    else {
      return Promise.resolve(this.graphClient);
    }
  }

  public async AddTeamMember(teamId: string, userId: string): Promise<any> {
    const directoryObject = {
      '@odata.id': 'https://graph.microsoft.com/beta/directoryObjects/' + userId
    };
    this.POST('/groups/' + teamId + '/members/$ref', directoryObject);

  }

}

export const GraphServiceInstance = new GraphService();
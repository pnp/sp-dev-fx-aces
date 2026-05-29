import { MSGraphClientV3 } from "@microsoft/sp-http";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { RetrievedTeams } from './types';

interface IGraphServiceContext {
  msGraphClientFactory: {
    getClient(version: "3"): Promise<MSGraphClientV3>;
  };
}

export interface IGraphService {
  GetTeams(): Promise<RetrievedTeams>;
}


class GraphService implements IGraphService {
  public context: IGraphServiceContext | undefined = undefined;
  private graphClient!: MSGraphClientV3;

  constructor() {

  }
  public async GetTeams(): Promise<RetrievedTeams> {
    const teams = await this.GET("groups", true, "resourceProvisioningOptions/Any(x:x eq 'Team')", "displayName,id,description,visibility,createdDateTime", 100);
    return teams as RetrievedTeams;
  }

  public async GetUserTeams(userId: string): Promise<RetrievedTeams> {
    const teams = await this.GET("users/" + userId + "/joinedTeams", false, "", "id");
    return teams as RetrievedTeams;
  }

  public async GetUserId(userEmail: string): Promise<{ value: Array<{ id: string }> }> {
    const userId = await this.GET("users", false, "proxyAddresses/Any(r:r eq 'SMTP:" + userEmail + "')", "id");
    return userId as { value: Array<{ id: string }> };
  }


  public async GetProfilePicture(groupId: string): Promise<string> {
    const photo = await this.GETPICTURE("/groups/" + groupId + "/photo/$value");
    const base64String = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(photo))));

    return base64String;
  }

  private POST(api: string, body: object): Promise<unknown> {
    return this.getClient()
      .then((client: MSGraphClientV3) =>
        client.api(api).version("beta").post(body)
      );
  }


  private GET(api: string, count: boolean, filter?: string, select?: string, top?: number, responseType?: string): Promise<unknown> {
    if (count) {
      return this.getClient()
        .then((client: MSGraphClientV3) => {
          const request = client.api(api).version("v1.0").select(select!).count(true).header("ConsistencyLevel", "eventual").filter(filter!).top(top!);
          return responseType !== undefined ? request.responseType(responseType as ResponseType).get() : request.get();
        });
    } else {
      return this.getClient()
        .then((client: MSGraphClientV3) => {
          const request = client.api(api).version("v1.0").select(select!).filter(filter!);
          return responseType !== undefined ? request.responseType(responseType as ResponseType).get() : request.get();
        });
    }
  }

  private GETPICTURE(api: string): Promise<ArrayBuffer> {
    return this.getClient()
      .then((client: MSGraphClientV3) =>
        client.api(api).version("beta").responseType(ResponseType.ARRAYBUFFER).get() as Promise<ArrayBuffer>
      );
  }


  private getClient(): Promise<MSGraphClientV3> {
    if (!this.graphClient) {
      return this.context!.msGraphClientFactory
        .getClient("3")
        .then((client: MSGraphClientV3) => {
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

  public async AddTeamMember(teamId: string, userId: string): Promise<unknown> {
    const directoryObject = {
      '@odata.id': 'https://graph.microsoft.com/beta/directoryObjects/' + userId
    };
    return this.POST('/groups/' + teamId + '/members/$ref', directoryObject);
  }

}

export const GraphServiceInstance = new GraphService();
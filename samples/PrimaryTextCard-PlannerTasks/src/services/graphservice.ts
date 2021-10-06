import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import util from "../common/utilities";

export interface IGraphService {
    GetUserProfile(): Promise<void>;
    GetAllTasks(): Promise<any>;
}

class GraphService implements IGraphService {
    public context = null;
    private graphClient: MSGraphClient;

    constructor() {

    }
    public async GetUserProfile(): Promise<any> {


        let userResponse: any = await this.GET("/me");
        let photoResponse: any = await this.GET("/me/photo/$value", "blob");

        let user = {
            name: userResponse.displayName,

            email: userResponse.mail,
            phone: userResponse.businessPhones[0],
            photo: window.URL.createObjectURL(photoResponse)
        };
        return user;
    }

    
    public async GetPlannerPlans(): Promise<MicrosoftGraph.PlannerPlan[]> {
        let response: any = await this.GET('/me/planner/plans', '');
        return response.value;
    }

    public async GetPlannerTasks(planId: string): Promise<MicrosoftGraph.PlannerTask[]> {
        let response: any = await this.GET(`/planner/plans/${planId}/tasks`, '');
        return response.value;
    }

    public async GetAllTasks(): Promise<MicrosoftGraph.PlannerTask[]> {
        let response: any = await this.GET('/me/planner/tasks', '');
        return response.value;
    }

    public async GetPlanInfo(planId: string): Promise<MicrosoftGraph.PlannerPlan> {
        let response = await this.GET(`/planner/plans/${planId}`);
        return response;
    }

    private GET(query: string, responseType?: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.getClient().then((client: MSGraphClient): void => {
                client.api(query).responseType(responseType)
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

    // private GET(query: string, responseType?: string): Promise<any> {
    //     return new Promise<any>((resolve, reject) => {
    //         this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
    //             client.api(query).responseType(responseType)
    //                 .get((error, response) => {
    //                     if (error) {
    //                         reject(error);
    //                         return;
    //                     }
    //                     resolve(response);
    //                 });
    //         });
    //     });
    // }
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

}

/**
 * Export only one Instance of GraphService Class
*/
export const GraphServiceInstance = new GraphService();

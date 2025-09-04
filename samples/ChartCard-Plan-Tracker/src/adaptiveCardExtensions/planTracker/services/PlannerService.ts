import { MSGraphClientV3 } from '@microsoft/sp-http';

/**
 * Represents a Planner task.
 */
export interface IPlannerTask {
  id: string;
  title: string;
  percentComplete: number;
  bucketId: string;
  dueDateTime?: string;
  startDateTime?: string;
  completedDateTime?: string;
  assignments: Record<string, unknown>;
  priority?: number;
}

/**
 * Represents a Planner bucket.
 */
export interface IPlannerBucket {
  id: string;
  name: string;
  orderHint: string;
}

/**
 * Represents a user.
 */
export interface IUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

/**
 * Service class for interacting with Microsoft Planner via Microsoft Graph.
 */
export default class PlannerService {
  private graphClient: MSGraphClientV3;

  /**
 * Initializes a new instance of the PlannerService class.
 * @param graphClient The MSGraphClientV3 instance.
 */
  constructor(graphClient: MSGraphClientV3) {
    this.graphClient = graphClient;
  }

  /**
  * Retrieves all buckets for a given Planner plan.
  * @param planId The ID of the Planner plan.
  * @returns A promise that resolves to an array of IPlannerBucket.
  */
  public async getBuckets(planId: string): Promise<IPlannerBucket[]> {
    try {
      const response = await this.graphClient
        .api(`/planner/plans/${planId}/buckets`)
        .version("v1.0")
        .get();

      return response.value as IPlannerBucket[];
    } catch (error) {
      console.error("Error fetching buckets: ", error);
      throw error;
    }
  }

  /**
   * Retrieves all tasks for a given Planner plan.
   * @param planId The ID of the Planner plan.
   * @returns A promise that resolves to an array of IPlannerTask.
   */
  public async getTasks(planId: string): Promise<IPlannerTask[]> {
    try {
      const response = await this.graphClient
        .api(`/planner/plans/${planId}/tasks`)
        .version("v1.0")
        .get();
      return response.value as IPlannerTask[];
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      throw error;
    }
  }


  /**
   * Retrieves the group ID (owner) for a given Planner plan.
   * @param planId The ID of the Planner plan.
   * @returns A promise that resolves to the group ID as a string.
   */
  public async getPlanGroupId(planId: string): Promise<string> {
    try {
      const response = await this.graphClient
        .api(`/planner/plans/${planId}`)
        .version("v1.0")
        .get();

      return response.owner as string; // This is the group ID
    } catch (error) {
      console.error("Error fetching group ID from plan: ", error);
      throw error;
    }
  }

  /**
  * Retrieves all members of a given group.
  * @param groupId The ID of the group.
  * @returns A promise that resolves to an array of IUser.
  */
  public async getPlanMembers(groupId: string): Promise<IUser[]> {
    try {
      const response = await this.graphClient
        .api(`/groups/${groupId}/members`)
        .version("v1.0")
        .get();

      return response.value as IUser[];
    } catch (error) {
      console.error("Error fetching plan members: ", error);
      throw error;
    }
  }

  /**
   * Retrieves all members of a Planner plan by plan ID.
   * @param planId The ID of the Planner plan.
   * @returns A promise that resolves to an array of IUser.
   */
  public async getPlanMembersByPlanId(planId: string): Promise<IUser[]> {
    try {
      const groupId = await this.getPlanGroupId(planId);
      const members = await this.getPlanMembers(groupId);
      return members;
    } catch (error) {
      console.error("Error fetching plan members by planId: ", error);
      throw error;
    }
  }

  /**
   * Retrieves the tenant ID for the current organization.
   * @returns A promise that resolves to the tenant ID as a string.
   */
  public async getTenantId(): Promise<string> {
    try {
      const response = await this.graphClient
        .api('/organization')
        .version('v1.0')
        .get();

      const tenantId = response.value[0]?.id;
      if (!tenantId) {
        throw new Error("Tenant ID not found in response.");
      }

      return tenantId;
    } catch (error) {
      console.error("Error fetching tenant ID: ", error);
      throw error;
    }
  }
}

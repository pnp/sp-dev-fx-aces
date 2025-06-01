import {
  IHealthServices,
  IServiceHealthResults,
} from "../models/IServiceHealthResults";

// services/serviceHealthService.ts
import { EScope } from "../constants/EScope";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import {getServiceHealthOverviews} from "./azureApiService";
import { sortBy } from "lodash";

/**
 * Sort services by status with "serviceOperational" at the end.
 */
export const sortDataByStatus = (data: IHealthServices[]): IHealthServices[] => {
  return sortBy(data, (item) => {
    const status = item.status;
    return status === "serviceOperational" ? "z" : status;
  });
};

/**
 * Fetch M365 service health data.
 */
export const fetchServiceHealthData = async (
  graphClient: MSGraphClientV3,
  scope: string
): Promise<IHealthServices[]> => {
  let data: IHealthServices[] = [];

  switch (scope.toLowerCase().trim()) {
    case EScope.ALL:
      data = await getServiceHealthOverviews();
      break;

    case EScope.ADMINS:
    case "": {
      const response: IServiceHealthResults = await graphClient
        .api("/admin/serviceAnnouncement/healthOverviews?$expand=issues")
        .version("v1.0")
        .get();
      data = response.value;
      break;
    }

    default:
      data = [];
      break;
  }

  return sortDataByStatus(data);
};
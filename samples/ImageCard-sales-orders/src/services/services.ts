/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from 'date-fns';

import { SearchHit } from '@microsoft/microsoft-graph-types';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import { MSGraphClientV3 } from '@microsoft/sp-http-msgraph';

import { IOrder } from '../models/IOrder';

export class Services {
  private _context: BaseComponentContext;
  private _msGraphClient: MSGraphClientV3 ;

  constructor(context: BaseComponentContext) {
    this._context = context;

  }

  public mappingOrders =  (result: SearchHit[]): IOrder[] => {
      const ordersList: IOrder[] = [];
      for (const item of result) {
        const { resource } = item;
        if (resource) {
          const { properties } = resource as any;
          if (properties) {
            const {
              id,
              custcode,
              custname,
              email,
              state,
              country,
              orders,
              orderdates,
              ordertotals,
              orderstatus,
            } = properties as any;

            for (let i = 0; i < orders.length; i++) {
              const order: IOrder = {

                customer: custname,
                city: `${state} ${country}`,
                order: orders[i],
                total: ordertotals[i],
                orderDate: format(new Date(orderdates[i]), "PP"),
                status: orderstatus[i],
                customerCode: custcode,
                custmoerEmail: email,
                customerState: state,
                id: id,
              };
              ordersList.push(order);
            }
          }
        }


    }
    return ordersList;

  }

  public searchOrders = async (searchText: string): Promise<IOrder[]> => {
    this._msGraphClient = await this._context.msGraphClientFactory.getClient("3");
      if (!this._msGraphClient) return [];
      const request = {
        requests: [
          {
            entityTypes: ["externalItem"],
            contentSources: ["/external/connections/ibmdb2lob"],
            query: {
              queryString: `${searchText}*`,
            },
            from: 0,
            size: 100,
          },
        ],
      };

      try {
        const response = await (this._msGraphClient)?.api(`search/query`).post(request);

        const result: SearchHit[] = response?.value[0]?.hitsContainers[0]?.hits;
        if (!result) return [];

        const ordersList = this.mappingOrders(result);
        console.log(ordersList);
        return ordersList;
      } catch (error) {
        console.log("[searchOrders] error:", error);
        throw new Error("Something went wrong when search Orders");
      }
      return [];
    }


}

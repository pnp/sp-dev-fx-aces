/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseAdaptiveCardQuickView,
  ISPFxAdaptiveCard,
} from '@microsoft/sp-adaptive-card-extension-base';

import { IOrder } from '../../../models/IOrder';
import { Services } from '../../../services/services';
import {
  ISalesOrdersAdaptiveCardExtensionProps,
  ISalesOrdersAdaptiveCardExtensionState,
} from '../SalesOrdersAdaptiveCardExtension';

export interface IQuickViewData {
  refreshLabel: string;
  orders: IOrder[];
}

export class QuickView extends BaseAdaptiveCardQuickView<
  ISalesOrdersAdaptiveCardExtensionProps,
  ISalesOrdersAdaptiveCardExtensionState,
  IQuickViewData
> {
  protected searchOrders = async (searchQuery: string): Promise<IOrder[]> => {
    console.log("onAction", searchQuery);
    const service = new Services(this.context);
    const result = await service.searchOrders(searchQuery);
    return result;
  };

  public get data(): IQuickViewData {
    return {
      refreshLabel: "",
      orders: this.state.orders,
    };
  }
  public async onAction(action: any): Promise<void> {
    const { data } = action;
    const searchQuery = data.input;
    const id = action.id;
    switch (action.type) {
      case "Submit":
        switch (id) {
          case "search":
            if (searchQuery) {
              this.setState({
                orders: await this.searchOrders(searchQuery),
              });
            }
            break;
          case "refresh":
            this.setState({
              orders: await this.searchOrders(""),
            });
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require("./template/QuickViewTemplate.json");
  }
}

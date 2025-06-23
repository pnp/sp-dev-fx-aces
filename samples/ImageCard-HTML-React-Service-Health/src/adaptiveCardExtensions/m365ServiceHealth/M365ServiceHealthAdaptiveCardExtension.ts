import {
  AdaptiveCardExtensionContext,
  BaseAdaptiveCardExtension,
} from "@microsoft/sp-adaptive-card-extension-base";
import { getAppTheme, isUserAdmin } from "./extensionHelper";

import { CardView } from "./cardView/CardView";
import { EScope } from "../../constants/EScope";
import { IHealthServices } from "../../models/IServiceHealthResults";
import type { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { M365ServiceHealthPropertyPane } from "./M365ServiceHealthPropertyPane";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { QuickView } from "./quickView/QuickView";
import { Theme } from "@fluentui/react-components";
import { fetchServiceHealthData } from "../../services/serviceHealthService";

export interface IM365ServiceHealthAdaptiveCardExtensionProps {
  title: string;
  scope: string;
}

export interface IM365ServiceHealthAdaptiveCardExtensionState {
  context: AdaptiveCardExtensionContext;
  theme?: Theme;
  data: IHealthServices[];
  error?: Error | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = "M365ServiceHealth_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "M365ServiceHealth_QUICK_VIEW";

const checkifUserIsAdmin = async (
  scope: EScope,
  graphClient: MSGraphClientV3
): Promise<boolean> => {
  try {
    if (scope.toLocaleLowerCase() === EScope.ADMINS.toLocaleLowerCase()) {
      const isAdmin = await isUserAdmin(graphClient);
      if (!isAdmin) {
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error(
      `[M365ServiceHealthAdaptiveCardExtension.checkifUserIsAdmin] Error: ${error}`
    );
    return false;
  }
  return false;
};

export default class M365ServiceHealthAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IM365ServiceHealthAdaptiveCardExtensionProps,
  IM365ServiceHealthAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: M365ServiceHealthPropertyPane;
  private _graphClient?: MSGraphClientV3;
  private intervalId: ReturnType<typeof setInterval> | undefined;
  private scope: EScope;

  public async onInit(): Promise<void> {
    this.state = {
      context: this.context,
      theme: undefined,
      data: [],
      error: undefined,
    };
    try {
      // registers the card view to be shown in a dashboard
      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      // registers the quick view to open via QuickView action
      this.quickViewNavigator.register(
        QUICK_VIEW_REGISTRY_ID,
        () => new QuickView()
      );

      this._graphClient = await this.context.msGraphClientFactory.getClient(
        "3"
      );

      const theme = await getAppTheme(this.context);

      this.scope = this.properties.scope as EScope;
      if (!this.scope) {
        this.scope = EScope.ADMINS;
      }

      if (
        this.scope.toLocaleLowerCase() === EScope.ADMINS.toLocaleLowerCase()
      ) {
        // Check if the user is an admin
        const isAdmin = await checkifUserIsAdmin(
          this.properties.scope as EScope,
          this._graphClient
        );
        if (!isAdmin) {
          this.setState({
            data: [],
            error: new Error("You do not have permission to view this data. "),
          });
          return;
        }
      }

      // check if interval is already set
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      // Set an interval to fetch data every 6 minutes
      // This is to ensure that the data is refreshed periodically
      // and the user sees the latest service health status
      // Note: The interval is set to 6 minutes (360000 milliseconds)
      this.intervalId = setInterval(async () => {
        if (!this._graphClient) return;
        const data: IHealthServices[] = await fetchServiceHealthData(
          this._graphClient,
          this.scope
        );
        this.setState({
          context: this.context,
          theme: theme,
          data: data,
        });
      }, 360000); // 6 minutes

      const data: IHealthServices[] = await fetchServiceHealthData(
        this._graphClient,
        this.scope
      );

      this.setState({
        context: this.context,
        theme: theme,
        data: data,
      });
    } catch (error) {
      console.error(
        `[M365ServiceHealthAdaptiveCardExtension.onInit] Error: ${error}`
      );
      this.setState({
        data: [],
        error: error as Error,
      });
    }

    return;
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    const component = await import(
      /* webpackChunkName: 'M365ServiceHealth-property-pane'*/
      "./M365ServiceHealthPropertyPane"
    );
    if (component) {
      this._deferredPropertyPane =
        new component.M365ServiceHealthPropertyPane();
    }
    return;
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}

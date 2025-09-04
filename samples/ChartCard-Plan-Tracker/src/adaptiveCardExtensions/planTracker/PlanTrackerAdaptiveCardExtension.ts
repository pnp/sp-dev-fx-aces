import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PlanTrackerPropertyPane } from './PlanTrackerPropertyPane';
import { QuickView } from './quickView/QuickView';
import PlannerService, { IPlannerBucket, IPlannerTask, IUser } from './services/PlannerService';

export interface IPlanTrackerAdaptiveCardExtensionProps {
  title: string;
  planId: string;
  iconProperty?: string;
  statusCollection?: {
    name: string;
    shortName: string;
    color: string;
  }[];
}

export interface IPlanTrackerAdaptiveCardExtensionState {
  buckets?: IPlannerBucket[];
  tasks?: IPlannerTask[];
  selectedBucketId?: string | undefined;
  taskStatusCounts?: {
    notStarted: number;
    inProgress: number;
    completed: number;
  };
  users?: IUser[];
  tenantId?: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'PlanTracker_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PlanTracker_QUICK_VIEW';

export default class PlanTrackerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPlanTrackerAdaptiveCardExtensionProps,
  IPlanTrackerAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PlanTrackerPropertyPane;
  private _plannerService: PlannerService;

  public async onInit(): Promise<void> {
    this.state = {};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    // Initialize default properties if not set
    if (!this.properties.statusCollection || this.properties.statusCollection.length !== 3) {
      this.properties.statusCollection = [
        { name: 'Not Started', shortName: 'NS', color: '#E0E0E0' },
        { name: 'In Progress', shortName: 'WIP', color: '#ffb900' },
        { name: 'Completed', shortName: 'COM', color: '#4CAF50' }
      ];
    }

    // Initialize PlannerService with MSGraphClient
    try {
      const graphClient = await this.context.msGraphClientFactory.getClient("3");
      this._plannerService = new PlannerService(graphClient);

      const planId = this.properties.planId;
      const [buckets, tasks, users, tenantId] = await Promise.all([
        this._plannerService.getBuckets(planId),
        this._plannerService.getTasks(planId),
        this._plannerService.getPlanMembersByPlanId(planId),
        this._plannerService.getTenantId()
      ]);

      let notStarted = 0;
      let inProgress = 0;
      let completed = 0;

      tasks.forEach(task => {
        if (task.percentComplete === 0) {
          notStarted++;
        } else if (task.percentComplete > 0 && task.percentComplete < 100) {
          inProgress++;
        } else if (task.percentComplete === 100) {
          completed++;
        }
      });

      this.setState({
        buckets,
        tasks,
        selectedBucketId: undefined,
        taskStatusCounts: {
          notStarted,
          inProgress,
          completed
        },
        users,
        tenantId
      });

    } catch (error) {
      console.error("Planner API error:", error);
    }
    return Promise.resolve();
  }

  public get iconProperty(): string {
    return this.properties.iconProperty || 'PlannerLogo';
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PlanTracker-property-pane' */
      './PlanTrackerPropertyPane'
    ).then((component) => {
      this._deferredPropertyPane = new component.PlanTrackerPropertyPane(this.properties);
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}

import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  IPlanTrackerAdaptiveCardExtensionProps,
  IPlanTrackerAdaptiveCardExtensionState
} from '../PlanTrackerAdaptiveCardExtension';
import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import QuickViewComponent from "./components/QuickViewComponents";

export class QuickView extends BaseWebQuickView<
  IPlanTrackerAdaptiveCardExtensionProps,
  IPlanTrackerAdaptiveCardExtensionState
> {
  public render(): void {
    if (this.domElement) {
      const { tasks = [], buckets = [], tenantId = '', users = [] } = this.state;
      const { planId, statusCollection } = this.properties;
      const statusColors = {
        completed: (statusCollection ?? []).filter(s => s.name === 'Completed')[0]?.color ?? '#4CAF50',
        inProgress: (statusCollection ?? []).filter(s => s.name === 'In Progress')[0]?.color ?? '#ffb900',
        notStarted: (statusCollection ?? []).filter(s => s.name === 'Not Started')[0]?.color ?? '#E0E0E0'
      };
      console.log("Rendering QuickView with state:", this.state);
      
      const element = React.createElement(QuickViewComponent, {
        context: this.context,
        tasks,
        buckets,
        users,
        planId,
        tenantId,
        statusColors
      });

      ReactDOM.render(element, this.domElement);
    } else {
      console.error("domElement is undefined");
    }
  }

  public onDispose(): void {
    if (this.domElement) {
      ReactDOM.unmountComponentAtNode(this.domElement);
    }
  }
}

import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState, GROUPS_SUMMARY_VIEW_REGISTRY_ID } from '../MyM365GroupsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: GROUPS_SUMMARY_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: `${this.state.ownerGroups.length + this.state.memberGroups.length} ${strings.PrimaryText}`,
      description: `${this.state.ownerGroups.length} owned, ${this.state.memberGroups.length} member groups`
    };
  }
}

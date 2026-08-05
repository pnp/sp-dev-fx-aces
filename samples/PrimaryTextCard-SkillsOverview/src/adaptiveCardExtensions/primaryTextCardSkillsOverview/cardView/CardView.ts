import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardSkillsOverviewAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../PrimaryTextCardSkillsOverviewAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState
> {
  public get cardButtons(): [ICardButton] | undefined {
    if (this.state.loading || this.state.errorMessage || this.state.latestSkills.length === 0) {
      return undefined;
    }
    return [
      {
        title: strings.SeeLatestSkillButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    const title: string = this.properties.title || strings.CardTitle;

    if (this.state.loading) {
      return {
        title,
        primaryText: strings.LoadingPrimaryText,
        description: strings.LoadingDescription
      };
    }

    if (this.state.errorMessage) {
      return {
        title,
        primaryText: strings.ErrorPrimaryText,
        description: strings.ErrorDescription
      };
    }

    if (this.state.skillsCount === 0) {
      return {
        title,
        primaryText: strings.EmptyPrimaryText,
        description: strings.EmptyDescription
      };
    }

    const primaryText: string =
      this.state.skillsCount === 1
        ? strings.CountPrimaryTextSingular
        : strings.CountPrimaryTextPlural.replace('{0}', this.state.skillsCount.toString());

    return {
      title,
      primaryText,
      description: strings.CountDescription
    };
  }
}

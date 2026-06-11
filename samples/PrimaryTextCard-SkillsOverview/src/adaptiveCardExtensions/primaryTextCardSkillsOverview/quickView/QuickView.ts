import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardSkillsOverviewAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState
} from '../PrimaryTextCardSkillsOverviewAdaptiveCardExtension';
import { ISkill } from '../models/ISkill';

export interface IQuickViewData {
  title: string;
  description: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const skill: ISkill | undefined = this.state.latestSkill;
    if (!skill) {
      return {
        title: strings.QuickViewNoSkillTitle,
        description: strings.QuickViewNoSkillDescription
      };
    }
    return {
      title: skill.title,
      description: skill.description
    };
  }

  public get template(): ISPFxAdaptiveCard {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./template/QuickViewTemplate.json');
  }
}

import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardSkillsOverviewAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState
} from '../PrimaryTextCardSkillsOverviewAdaptiveCardExtension';
import { ISkill } from '../models/ISkill';

export interface IQuickViewSkillItem {
  title: string;
  description: string;
}

export interface IQuickViewData {
  heading: string;
  hasSkills: boolean;
  emptyMessage: string;
  skills: IQuickViewSkillItem[];
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const latestSkills: ISkill[] = this.state.latestSkills;
    if (latestSkills.length === 0) {
      return {
        heading: strings.QuickViewListTitle,
        hasSkills: false,
        emptyMessage: strings.QuickViewNoSkillDescription,
        skills: []
      };
    }
    return {
      heading: strings.QuickViewListTitle,
      hasSkills: true,
      emptyMessage: '',
      skills: latestSkills.map((s: ISkill): IQuickViewSkillItem => ({
        title: s.title,
        description: s.description
      }))
    };
  }

  public get template(): ISPFxAdaptiveCard {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./template/QuickViewTemplate.json');
  }
}

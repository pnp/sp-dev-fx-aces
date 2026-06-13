import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardSkillsOverviewAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState,
  SKILL_DETAIL_QUICK_VIEW_REGISTRY_ID
} from '../PrimaryTextCardSkillsOverviewAdaptiveCardExtension';
import { ISkill } from '../models/ISkill';

const NO_DESCRIPTION_PLACEHOLDER: string = '(No description provided)';
const MAX_FIRST_SENTENCE_LENGTH: number = 160;
const CHEVRON_GLYPH: string = '\u203A';

export interface IQuickViewSkillItem {
  index: number;
  title: string;
  description: string;
  chevron: string;
}

export interface IQuickViewData {
  heading: string;
  hasSkills: boolean;
  emptyMessage: string;
  skills: IQuickViewSkillItem[];
}

export function extractFirstSentence(description: string): string {
  const trimmed: string = description.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }
  if (trimmed === NO_DESCRIPTION_PLACEHOLDER) {
    return trimmed;
  }

  const match: RegExpExecArray | null = /[.!?](\s|$)/.exec(trimmed);
  const sentence: string = match ? trimmed.substring(0, match.index + 1) : trimmed;

  if (sentence.length > MAX_FIRST_SENTENCE_LENGTH) {
    return `${sentence.substring(0, MAX_FIRST_SENTENCE_LENGTH - 1)}\u2026`;
  }
  return sentence;
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
      skills: latestSkills.map((s: ISkill, i: number): IQuickViewSkillItem => ({
        index: i,
        title: s.title,
        description: extractFirstSentence(s.description),
        chevron: CHEVRON_GLYPH
      }))
    };
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      const data: { id?: string; index?: number } = action.data as { id?: string; index?: number };
      if (data?.id === 'openSkill' && typeof data.index === 'number') {
        this.setState({ selectedSkillIndex: data.index });
        this.quickViewNavigator.push(SKILL_DETAIL_QUICK_VIEW_REGISTRY_ID);
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./template/QuickViewTemplate.json');
  }
}

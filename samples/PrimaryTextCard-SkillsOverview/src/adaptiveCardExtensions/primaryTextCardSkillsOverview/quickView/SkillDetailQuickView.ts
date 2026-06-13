import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardSkillsOverviewAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState
} from '../PrimaryTextCardSkillsOverviewAdaptiveCardExtension';
import { ISkill } from '../models/ISkill';

export interface ISkillDetailQuickViewData {
  title: string;
  description: string;
  openUrl: string;
  openLabel: string;
  hasSkill: boolean;
}

export class SkillDetailQuickView extends BaseAdaptiveCardQuickView<
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState,
  ISkillDetailQuickViewData
> {
  public get data(): ISkillDetailQuickViewData {
    const index: number | undefined = this.state.selectedSkillIndex;
    const skills: ISkill[] = this.state.latestSkills;
    const skill: ISkill | undefined =
      typeof index === 'number' && index >= 0 && index < skills.length ? skills[index] : undefined;

    if (!skill) {
      return {
        title: strings.QuickViewNoSkillTitle,
        description: strings.QuickViewNoSkillDescription,
        openUrl: '',
        openLabel: strings.QuickViewOpenFolderButton,
        hasSkill: false
      };
    }

    const fileServerRelativeUrl: string = skill.serverRelativeUrl;
    const lastSlashIndex: number = fileServerRelativeUrl.lastIndexOf('/');
    const parentServerRelativeUrl: string = lastSlashIndex > 0
      ? fileServerRelativeUrl.substring(0, lastSlashIndex)
      : fileServerRelativeUrl;
    const origin: string = new URL(this.context.pageContext.web.absoluteUrl).origin;
    const openUrl: string = `${origin}${parentServerRelativeUrl}`;

    return {
      title: skill.title,
      description: skill.description,
      openUrl: openUrl,
      openLabel: strings.QuickViewOpenFolderButton,
      hasSkill: true
    };
  }

  public get template(): ISPFxAdaptiveCard {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./template/SkillDetailQuickViewTemplate.json');
  }
}

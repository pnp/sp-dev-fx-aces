import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SkillDetailQuickView } from './quickView/SkillDetailQuickView';
import { PrimaryTextCardSkillsOverviewPropertyPane } from './PrimaryTextCardSkillsOverviewPropertyPane';
import { SkillsService } from './services/SkillsService';
import { ISkill } from './models/ISkill';

export interface IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps {
  title: string;
}

export interface IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState {
  loading: boolean;
  errorMessage?: string;
  skillsCount: number;
  latestSkills: ISkill[];
  selectedSkillIndex?: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_SKILLS_OVERVIEW_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_SKILLS_OVERVIEW_QUICK_VIEW';
export const SKILL_DETAIL_QUICK_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_SKILLS_OVERVIEW_SKILL_DETAIL_QUICK_VIEW';
export const LATEST_SKILLS_COUNT: number = 5;

export default class PrimaryTextCardSkillsOverviewAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionProps,
  IPrimaryTextCardSkillsOverviewAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PrimaryTextCardSkillsOverviewPropertyPane | undefined;
  private _skillsService!: SkillsService;

  public onInit(): Promise<void> {
    this.state = {
      loading: true,
      skillsCount: 0,
      latestSkills: [],
      selectedSkillIndex: undefined
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(SKILL_DETAIL_QUICK_VIEW_REGISTRY_ID, () => new SkillDetailQuickView());

    this._skillsService = new SkillsService(this.context);

    this._loadSkills().catch((error: unknown) => {
      console.error('PrimaryTextCardSkillsOverview: failed to load skills.', error);
    });

    return Promise.resolve();
  }

  private async _loadSkills(): Promise<void> {
    try {
      const [count, latest] = await Promise.all([
        this._skillsService.getSkillsCount(),
        this._skillsService.getLatestSkills(LATEST_SKILLS_COUNT)
      ]);

      this.setState({
        loading: false,
        errorMessage: undefined,
        skillsCount: count,
        latestSkills: latest
      });
    } catch (error) {
      const message: string = error instanceof Error ? error.message : 'Unknown error';
      console.error('PrimaryTextCardSkillsOverview: error loading skills.', error);
      this.setState({
        loading: false,
        errorMessage: message,
        skillsCount: 0,
        latestSkills: []
      });
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'primary-text-card-skills-overview-property-pane'*/
      './PrimaryTextCardSkillsOverviewPropertyPane'
    ).then((component) => {
      this._deferredPropertyPane = new component.PrimaryTextCardSkillsOverviewPropertyPane();
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration() ?? super.getPropertyPaneConfiguration();
  }
}

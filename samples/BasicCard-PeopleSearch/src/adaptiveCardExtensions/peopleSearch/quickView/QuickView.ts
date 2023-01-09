import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IUsers } from '../../Model/IUsers';
import { GraphAPIService } from '../../Service/GraphAPIService';
import { IGraphAPIService } from '../../Service/IGraphAPIService';
import { IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState } from '../PeopleSearchAdaptiveCardExtension';

export interface IQuickViewData {
  users: Array<IUsers>;
  displayproperty: string;
  defaultMessageText: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState,
  IQuickViewData
> {
  private graphService: IGraphAPIService;

  public get data(): IQuickViewData {
    return {
      users: this.state.users,
      displayproperty: 'jobTitle',
      defaultMessageText: this.properties.defaultMessageText
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, filterByName } = action.data;
        if (id === 'userFilter') {
          this.graphService = new GraphAPIService(this.context);
          const usersData: Array<IUsers> = await this.graphService.fetchUsers(filterByName);
          this.setState({ users: usersData });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
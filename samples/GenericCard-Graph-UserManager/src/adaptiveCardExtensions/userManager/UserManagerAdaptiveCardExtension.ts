import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { ResponseType } from '@microsoft/microsoft-graph-client';

export interface IUserManagerAdaptiveCardExtensionProps {
}

export interface IUserManagerAdaptiveCardExtensionState {
	managerPicture?: string;
	manager?: any;
  error: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'UserManager_CARD_VIEW';

export default class UserManagerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IUserManagerAdaptiveCardExtensionProps,
  IUserManagerAdaptiveCardExtensionState
> {

  public async onInit(): Promise<void> {
    this.state = {
			managerPicture: undefined,
			manager: undefined,
      error: false
		};

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView(this._loadManager));

    try {
      await this._loadManager();
    }
    catch(error) {
      this.setState({
        error: true
      });
    }

    return Promise.resolve();
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  private async _loadManager(): Promise<void> {
    const graphClient = await this.context.msGraphClientFactory.getClient("3");
    const response = await graphClient
      .api("/me/manager")
      .get()
      .catch((error) => {
        return null;
      });
      console.log(response);
    
      // An error occurred while executing the request
    if (response === null) {
      this.setState({
        error: true,
      });

      return;
    }

    let managerPhotoBlob: string | undefined = undefined;

    // If the manager has a picture, retrieve it
    const managerPicture = await graphClient
      .api(`/users/${response.id}/photos/360x360/$value`)
      .responseType(ResponseType.BLOB)
      .get()
      .catch(error => {
        return undefined;
      });
    
    if (managerPicture) {
      managerPhotoBlob = URL.createObjectURL(managerPicture).toString();
    }

    // Update the state with the manager infos
    this.setState({
			managerPicture: managerPhotoBlob,
			manager: response,
			error: false,
		});
  }
}

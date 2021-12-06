import { AdaptiveCardExtensionContext, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { UnreadEmailsPropertyPane } from './UnreadEmailsPropertyPane';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { MSGraphClient } from '@microsoft/sp-http';
import * as strings from 'UnreadEmailsAdaptiveCardExtensionStrings';

export interface IUnreadEmailsAdaptiveCardExtensionProps {
  iconProperty: string;
}

export interface IUnreadEmailsAdaptiveCardExtensionState extends MicrosoftGraph.MailFolder {

}

const CARD_VIEW_REGISTRY_ID: string = 'UnreadEmails_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'UnreadEmails_QUICK_VIEW';

export default class UnreadEmailsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IUnreadEmailsAdaptiveCardExtensionProps,
  IUnreadEmailsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: UnreadEmailsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { unreadItemCount: -1 };
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
      client.api("/me/mailfolders/Inbox").select("unreadItemCount").get((error, inbox: MicrosoftGraph.MailFolder) => {
        this.setState(inbox);
      });
    });
    return Promise.resolve();
  }

  public get title(): string {
    return strings.Loading.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'UnreadEmails-property-pane'*/
      './UnreadEmailsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.UnreadEmailsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }
}

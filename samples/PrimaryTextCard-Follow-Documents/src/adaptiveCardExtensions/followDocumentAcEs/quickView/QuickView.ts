import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';
import { IFollowDocumentAcEsAdaptiveCardExtensionProps, IFollowDocumentAcEsAdaptiveCardExtensionState } from '../FollowDocumentAcEsAdaptiveCardExtension';
import { FollowDocument } from '../models/followDocument';
import Rest from '../Service/Rest';

export interface IQuickViewData {
  followDocuments: FollowDocument | FollowDocument[];
  ID?: number;
  Total?: number;
}

export class QuickView extends BaseAdaptiveCardView<
  IFollowDocumentAcEsAdaptiveCardExtensionProps,
  IFollowDocumentAcEsAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 Follow Documents";
  public get data(): IQuickViewData {
    if (this.properties.view === "Slider" || this.properties.view === undefined) {
      const FollowDocuments = (this.state.followDocuments.length == undefined ? this.state.followDocuments : this.state.followDocuments[this.state.ID - 1]);
      return {
        ID: this.state.ID,
        followDocuments: FollowDocuments,
        Total: this.state.followDocuments.length == undefined ? 1 : this.state.followDocuments.length,
      };
    } else {
      return {
        followDocuments: this.state.followDocuments,
      };
    }

  }

  public get template(): ISPFxAdaptiveCard {
    return (this.properties.view === "Slider" || this.properties.view === undefined ? require('./template/SliderTemplate.json') : require('./template/ListTemplate.json'));
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex, Url, Web } = action.data;
        if (id === 'previous') {
          let idx = this.state.ID;

          idx--;
          if (idx < 1) {
            idx = 1;
          }

          this.setState({ ID: idx });
        } else if (id === 'next') {
          let idx = this.state.ID;
          idx++;
          if (idx > (this.state.followDocuments.length == undefined ? 1 : this.state.followDocuments.length)) {
            idx = (this.state.followDocuments.length == undefined ? 1 : this.state.followDocuments.length);
          }
          this.setState({ ID: idx });
        }
        if (id === 'unfollow') {
          const restService: Rest = new Rest();
          const Status = await restService.stopfollowing(
            this.context.spHttpClient,
            Url,
            Web,
          );
          if (Status === true) {
            let data = [];
            this.state.followDocuments.forEach(element => {
              if (element.fields["Url"] !== Url) {
                data.push(element);
              }
            });
            this.setState({
              followDocuments: data,
              ID: 1,
            });
          }
        }
      }
    } catch (err) {
      console.error(this.LOG_SOURCE, err);
    }
  }
}
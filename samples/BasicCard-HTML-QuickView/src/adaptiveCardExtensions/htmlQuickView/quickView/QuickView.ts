import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HtmlQuickViewAdaptiveCardExtensionStrings';
import {
  IHtmlQuickViewAdaptiveCardExtensionProps,
  IHtmlQuickViewAdaptiveCardExtensionState
} from '../HtmlQuickViewAdaptiveCardExtension';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './QuickView.module.scss';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseWebQuickView<
  IHtmlQuickViewAdaptiveCardExtensionProps,
  IHtmlQuickViewAdaptiveCardExtensionState
> {

  render(): void {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const welcomeImage: string = require('./assets/welcome-light.png');
    this.domElement.innerHTML = `
      <section class="${styles.helloWorld}">
        <div class="${styles.welcome}">
          <img alt="" src="${welcomeImage}" class="${styles.welcomeImage}" />
          <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        </div>
        <div>
          <h3>Welcome to HTML powered SPFx quick views!</h3>
          <p>
          Starting with SPFx 1.20, you can use any HTML in the ACE quick views to build engaging employee experiences!
          </p>
          <h4>Learn more about Viva Connections extensibility development:</h4>
            <ul class="${styles.links}">
              <li><a href="https://aka.ms/spfx" target="_blank">Viva Connections Extensibility Overview</a></li>            
              <li><a href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</a></li>

              <li><a href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</a></li>
            </ul>
        </div>
      </section>`;
  }

  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

}

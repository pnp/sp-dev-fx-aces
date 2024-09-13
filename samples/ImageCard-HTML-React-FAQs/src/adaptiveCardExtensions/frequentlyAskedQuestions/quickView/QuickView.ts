import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'FrequentlyAskedQuestionsAdaptiveCardExtensionStrings';
import {
  IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
  IFrequentlyAskedQuestionsAdaptiveCardExtensionState
} from '../FrequentlyAskedQuestionsAdaptiveCardExtension';
import { FAQAccordion } from './components/faqAccordion';

export class QuickView extends BaseWebQuickView<
  IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
  IFrequentlyAskedQuestionsAdaptiveCardExtensionState
> {

  render(): void {
    const { faqs, allowMultipleExpanded } = this.properties;
    const element: React.ReactElement<{}> = React.createElement(FAQAccordion, {
      faqs,
      allowMultipleExpanded,
      theme: this.state.theme
    });
    ReactDOM.render(element, this.domElement);
  }

  public onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.dispose();
  }
}

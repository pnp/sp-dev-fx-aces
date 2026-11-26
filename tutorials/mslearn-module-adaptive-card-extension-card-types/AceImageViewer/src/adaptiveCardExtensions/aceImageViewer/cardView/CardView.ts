import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  ImageCardView,
  ICardButtonParameters,
  CardViewActionsFooterConfiguration,
  IActionArguments,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../AceImageViewerAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    const previousButton: ICardButtonParameters = {
      componentName: 'cardButton',
      title: '<',
      id: '-1',
      action: { type: 'Submit', parameters: {} }
    };
    const nextButton: ICardButtonParameters = {
      componentName: 'cardButton',
      title: '>',
      id: '1',
      action: { type: 'Submit', parameters: {} }
    };

    const showPrevious = this.state.currentIndex !== 0;
    const showNext = this.state.currentIndex !== (this.state.images.length - 1);

    const footer: CardViewActionsFooterConfiguration = (showPrevious && showNext)
      ? [previousButton, nextButton]
      : (showPrevious)
        ? previousButton
        : (showNext)
          ? nextButton
          : undefined;

    if (!this.properties.searchQuery) {
      return ImageCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: `Enter a search term to display NASA images...`
        },
        image: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tharsis_and_Valles_Marineris_-_Mars_Orbiter_Mission_%2830055660701%29.png/240px-Tharsis_and_Valles_Marineris_-_Mars_Orbiter_Mission_%2830055660701%29.png',
          altText: `Enter a search term to display NASA images...`
        },
        footer
      });
    }

    const currentImage = this.state.images[this.state.currentIndex];

    if (!currentImage) {
      return ImageCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: `Please refresh the page to reload the images`
        },
        image: {
          url: '',
          altText: ''
        },
        footer
      });
    }

    return ImageCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: `${this.state.currentIndex + 1} of ${this.state.images.length}: ${currentImage.title}`
      },
      image: {
        url: currentImage.thumbnailUrl,
        altText: currentImage.title
      },
      footer
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') { return; }

    const currentIndex = this.state.currentIndex;
    this.setState({ currentIndex: currentIndex + Number(action.id) });
  }
}

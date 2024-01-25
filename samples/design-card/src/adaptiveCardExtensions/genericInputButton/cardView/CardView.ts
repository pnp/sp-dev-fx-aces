import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  TextInputCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericInputButtonAdaptiveCardExtensionStrings';
import {
  IGenericInputButtonAdaptiveCardExtensionProps,
  IGenericInputButtonAdaptiveCardExtensionState
} from '../GenericInputButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericInputButtonAdaptiveCardExtensionProps,
  IGenericInputButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return TextInputCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Send-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.SubTitle
      },
      body: {
        componentName: 'textInput',
        placeholder: strings.TextboxPlaceholder,
        iconBefore: {
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG4SURBVFhHxZeBVcIwFEXB4wAygTqCE6gT6AbKBt3A4wbdADdQJ1A2YAPYQEbw3fR/bGsoLW3DPeebADl5P/+lSZ1mWbaeFLzmef5m/WScKS4UV4oFySie+SEVJPBZdAPJEyGB76Ib2rlio0iWCHsAC34UW+2BGV+a6IuCRICkRtkjU/5IEIFLxb1EvCJJEsEC+LD2ztoAQoprdUezpp7ArbUVxkzELfB9ADOJba0fxUQHsSYkAJr0Sw0WVPZBE0Mk4hbA0tpHaw+CkKKXNeUEfNUP1ramTyI7C0CD2Qfsh4P7oAkTbWVNuQKwsra1DTG6VKSegN8L0cexK20SqVvAAL+ej2FjglFMtGJNvQL4n5Rzax0/iikdZRuE2MoVYVPWK+AJ+JnQC4QVWLpQII7wHJsQV3/vY8gABh9F04qLj3+Uj2JWz3G80sCb8GVHugg7ZQuOLj/CisZS76OcgD/7rS4i6CPsBAs0yWmvY03I0fuuWGoSt+IfQwo7boGLRsuPsKJXqffhCUT9H1PY4bWciRE5zWu5ibFCbkJeTpMIOyTA5E/Fxx2jCzv+33GyFdfxBCCpcMFk8gsOoCfdGrZmAAAAAABJRU5ErkJggg==',
          altText: ''
        },
        onChange: (newValue: string) => {
          // NOOP
        }
      },
      footer: {
        componentName: 'cardButton',
        title: strings.Button,
        style: 'positive',
        action: {
          type: 'ExternalLink',
          parameters: {
            isTeamsDeepLink: false,
            target: 'https://pnp.github.io/'
          }
        }      
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}

import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  TextInputImageCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericTextInputButtonImageAdaptiveCardExtensionStrings';
import {
  IGenericTextInputButtonImageAdaptiveCardExtensionProps,
  IGenericTextInputButtonImageAdaptiveCardExtensionState
} from '../GenericTextInputButtonImageAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericTextInputButtonImageAdaptiveCardExtensionProps,
  IGenericTextInputButtonImageAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return TextInputImageCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Location-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      image: {
        url: require('../assets/Pins.png'),
        altText: strings.PrimaryText
      },
      body: {
        componentName: 'textInput',
        placeholder: strings.TextboxPlaceholder,
        iconBefore: {
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAYAAADj79JYAAAAAXNSR0IArs4c6QAABqNJREFUeF7tnT1sHUUQx/9TWESCEqdKAZKFsRSQAgVGcgorDTQpCBSEAhmCJbBERUCIyJatIARJhWQimQ+LgqQgoaCBJnIRS5ACLEEkA7IwRao4JZFALoab8565d37vbvf2493XVU/27tzs783bj9nZWULFHma+D8AxAEcBjAN4GMARAIfV534abwO4A+A2APn8O4BbADaI6N8qNZGqoAwzPwPgBIDjAJ5yrNPNSPaNSPZ1IvresWxjcUMDzszPRVb4PICTAO431rxchXsAvo1+PVeJ6JtyIuxqBQXOzI8AeBXAKwAetFPduvZdAF8A+JyI/rCWpikgCHBmlm7iTQCnNfUKXewygI+JSLofr49X4Mz8GIB3o0HsRa+tcCf8CoAPiOhXdyJ7JXkBrmYa5wG85Utxz3IvAjjnY4bjHDgzy0B4AcBDnqH4Fv8XgLNEdNXli5wBZ2aRtQzgdZcKVkDWJQBzRMQudHECnJmfiBYnn6kFiwu9qiZjI1pUnSGin20VswbOzDIgfglgxFaZitffjVaxLxORDKylHyvgzCyDovTXbXqkX5dBtdRTGjgzyyzkvVJvrX+l94noXJlmlALOzB8CeLvMCxtU5yMiese0PcbAW27ZWb7Glm4EvKV9dpERG/Xp2sDVbER8Dt1zkMBp3dmLFnA1z/6xBVO/ssYkU8ZJnXl6IXC1gvypwYuaspCz9WRx9GTRilQH+CcNXK67gpyVc4mI3sgTngtcOaK+9qVdQ+W+kOfwGghcuVh/a4DXL/T3Kl7GRwe5dvOAy5K9rv7s0JCz77tIRGf7KdEXuNqp+WXYWtf8/Y/32zkaBFzm23XZFqvq93Il2pw+sId7ALja8JU5d6ufnZ2duP2jo6M2HGRu3rMx3Q/4VxXeXbdpvHbdra0tzM7OYnd3F6urqxgbG9Oumyl4mYheSv+tB7iKG5EwsdY+Cey1tbWYwdTUlC308XTcSxZ4q92uWdgCfHp6GsvLy5iYmChrhD1u3Cxw6biGHRFVtmFW9QbBXllZselSRKe7RLQ/EOwDV7F+16y0rmllj7ATIqeSWMY08FZOBQPAFuj7U8Q08L8DRrFW4rcQCLa09V608fyAfIiBq/js7ypBIZASAWEnLXpW4tMT4K3ymwwBtkCP/SsJcFlZuj55EMhWzV4zJNii5M3IwidJuWH/MVO7nqWHCDsBdkiATwL4oZ4I9bWuAGxR9mkBfgbAp/qq169kRWALuNcEeKMHzArB3hs4mVkCzk/Vz26LNa4YbFH4mgBv5AylgrD3ZirM/GfOCd9iM6pgiYrCFlLbAtzJUYqqcK8w7BhRo4BXHXajgNcBthfgjjZfjXqousB2DlwaPjMzg5GRETjYKdGCXifYToEnsNfX12NQshfoG3rdYCfAnUwLNzc3MTc3h2S32zf0OsJOpoXOFj6hIIR6j1afZlYoXvg4Xdr7huFbvhk/49Lx0t6588oXFF9yjbGVrxA7r7y4Z13DcS2vPDOrmrF71tsGhCtIruRYoXJTOd6AkLR13rbYbGHZ1nfDyZmUQ0E2kctCK1vPGR63gvY2kUWmj4Ezq6spPNPybtl4kdYTJiGJGr0HAulC1C3nBYs/of8HAikrDxLqVgQz6yLwvWL1x7dHcm+omwIeLJizH3QJfJ+fn8fS0hISf0xDYEsz+gZzSmrSYOHK/aBnrS2EAyyQhR8MV1ZWHjQgPw96g2D3D8hXwIMfORnUvVgeZgpkuFqvyT1yIsl4gx+qSg+UDg4xaVEIWGjwoSpl5UM5NijQFxcXsbCwYHumJiDLwlflHxtUwCVsufUHYwtR6hUoPhgbeoqop3ctS+kd/VbAJQ11l9zA7nvWT24Qyr9i155K1zZL36GAi9u2S1Bj/r2WS1CjoEsu8C4Fkxn0cimYkncwc5dkTB+4XZIxZeXiM+/S6BVDd5NGT0GXhOxdosjB0N0likx1LZKSqUuF2h+621SoKehtTNBe1Jn4Sfabgt7mRO1Z+H7TWaegB3fjFpnZEP4fJmF7Z+kxAWPLTrgVJvvNs5yWJnA36rOz/KyAqyljd62MQX9mDTw1T+8uTtIA7wR4akXaXQ1WAN0Z8NRg2l1+lwPdOXBl7eLa7a537APeC/CUtXcXmGagewWeAt9d0atgBAGeAt9dQq0xk/FSpLtm3QtWPaEqUeUJAMc9pPOThOk3ItnXJVGjnkb+SgXtUnSaoc4cHQNwNArzHVfJc44AOJyTSGcbwJ3oVtfbctpXhevdArDh4yJpnXYMKvMfC8TOSGXhFk0AAAAASUVORK5CYII=',
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

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import {
  BasePrimaryTextCardView,
  IExternalLinkCardAction,
  IPrimaryTextCardParameters,
  IQuickViewCardAction,
} from "@microsoft/sp-adaptive-card-extension-base";

import {
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from "../../adaptiveCardExtensions/myDay/MyDayAdaptiveCardExtension";

const line1 = require('../../../assets/line1Orange.png');

export class CardView extends BasePrimaryTextCardView<
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState
> {
  private timerId: number;
  constructor() {
    super();
  }
  /*  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }
 */
  public get data(): IPrimaryTextCardParameters {
    const selectedDate = (this.properties.date.value as any) as string;
    const weekDay = format(parseISO(selectedDate), "cccc").toUpperCase();
    const day = format(parseISO(selectedDate), this.cardSize === "Medium" ? "d MMM" : "d MMMM").toUpperCase();
    const numberofEvents = this.state.events.length;
    const eventsInfo = numberofEvents > 0 ? `( **${numberofEvents}** events)` : "( no events )";
    const CARDDATA_TEMPLATE = `
|   ${weekDay} |
| :--------:|
| ${eventsInfo} |
![line](${line1})
`;
    let cardData = CARDDATA_TEMPLATE;
    return {
      title: this.properties.title,
      primaryText: `# ${day}  `,
      description: cardData,
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: "QuickView",
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID,
      },
    };
  }
}

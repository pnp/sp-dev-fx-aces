import * as strings from 'MyRecentFilesAdaptiveCardExtensionStrings';

import {
  BaseImageCardView,
  ICardButton,
  IExternalLinkCardAction,
  IImageCardParameters,
  IQuickViewCardAction,
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  IMyRecentFilesAdaptiveCardExtensionProps,
  IMyRecentFilesAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../MyRecentFilesAdaptiveCardExtension';

const imageUrl: any = require("../../../assets/files.png");
const iconProperty =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQwMCA0MDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwMCA0MDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJYTUxJRF84MDdfIj4NCgk8ZyBpZD0iWE1MSURfODA4XyI+DQoJCTxwb2x5Z29uIGlkPSJYTUxJRF83NV8iIHN0eWxlPSJmaWxsOiNBQ0FCQjE7IiBwb2ludHM9IjkwLDMyMCA5MCwwIDI5MCwwIDM1MCw2MCAzNTAsMzIwIAkJIi8+DQoJCTxwb2x5Z29uIGlkPSJYTUxJRF84MDlfIiBzdHlsZT0iZmlsbDojODE4MDg1OyIgcG9pbnRzPSIyOTAsMCAzNTAsNjAgMjkwLDYwIAkJIi8+DQoJPC9nPg0KCTxnIGlkPSJYTUxJRF84MTBfIj4NCgkJPHBvbHlnb24gaWQ9IlhNTElEXzcyXyIgc3R5bGU9ImZpbGw6I0VFRUVFRjsiIHBvaW50cz0iNzAsMzYwIDcwLDQwIDI3MCw0MCAzMzAsMTAwIDMzMCwzNjAgCQkiLz4NCgkJPHBvbHlnb24gaWQ9IlhNTElEXzgxMV8iIHN0eWxlPSJmaWxsOiNERURERTA7IiBwb2ludHM9IjI3MCw0MCAzMzAsMTAwIDI3MCwxMDAgCQkiLz4NCgk8L2c+DQoJPHBvbHlnb24gaWQ9IlhNTElEXzY4XyIgc3R5bGU9ImZpbGw6Izc4QjlFQjsiIHBvaW50cz0iNTAsNDAwIDUwLDgwIDI1MCw4MCAzMTAsMTQwIDMxMCw0MDAgCSIvPg0KCTxwb2x5Z29uIGlkPSJYTUxJRF84MTJfIiBzdHlsZT0iZmlsbDojNUE4QkIwOyIgcG9pbnRzPSIzMTAsMjUzLjc1IDUwLDQwMCAzMTAsNDAwIAkiLz4NCgk8cmVjdCBpZD0iWE1MSURfODEzXyIgeD0iMTEwIiB5PSIyMDAiIHN0eWxlPSJmaWxsOiNERURERTA7IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwIi8+DQoJPHJlY3QgaWQ9IlhNTElEXzgxNF8iIHg9IjExMCIgeT0iMjQwIiBzdHlsZT0iZmlsbDojREVEREUwOyIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIyMCIvPg0KCTxyZWN0IGlkPSJYTUxJRF84MTVfIiB4PSIxMTAiIHk9IjE2MCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIHdpZHRoPSI3MCIgaGVpZ2h0PSIyMCIvPg0KCTxyZWN0IGlkPSJYTUxJRF84MTZfIiB4PSIxMTAiIHk9IjIwMCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIHdpZHRoPSI3MCIgaGVpZ2h0PSIyMCIvPg0KCTxyZWN0IGlkPSJYTUxJRF84MTdfIiB4PSIxMTAiIHk9IjI0MCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIHdpZHRoPSI3MCIgaGVpZ2h0PSIyMCIvPg0KCTxyZWN0IGlkPSJYTUxJRF84MThfIiB4PSIxMTAiIHk9IjI4MCIgc3R5bGU9ImZpbGw6I0RFRERFMDsiIHdpZHRoPSIxNDAiIGhlaWdodD0iMjAiLz4NCgk8cmVjdCBpZD0iWE1MSURfODE5XyIgeD0iMTEwIiB5PSIyODAiIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiB3aWR0aD0iNzAiIGhlaWdodD0iMjAiLz4NCgk8cmVjdCBpZD0iWE1MSURfODIwXyIgeD0iMTEwIiB5PSIzMjAiIHN0eWxlPSJmaWxsOiNERURERTA7IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwIi8+DQoJPHJlY3QgaWQ9IlhNTElEXzgyMV8iIHg9IjExMCIgeT0iMzIwIiBzdHlsZT0iZmlsbDojRkZGRkZGOyIgd2lkdGg9IjcwIiBoZWlnaHQ9IjIwIi8+DQoJPHBvbHlnb24gaWQ9IlhNTElEXzgyMl8iIHN0eWxlPSJmaWxsOiMxRTJFM0I7IiBwb2ludHM9IjI1MCw4MCAzMTAsMTQwIDI1MCwxNDAgCSIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=";
export class CardView extends BaseImageCardView<
  IMyRecentFilesAdaptiveCardExtensionProps,
  IMyRecentFilesAdaptiveCardExtensionState
> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: "QuickView",
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID,
          },
        },
      },
    ];
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: strings.PrimaryText,
      imageUrl: imageUrl,
      title: this.properties.title,
      iconProperty: iconProperty,
    };
  }
  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if (this.cardSize === 'Large') return null;
    return {
      type: "QuickView",
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID,
      },
    };
  }
}

import {
  BaseImageCardView,
  IImageCardParameters, 
  IExternalLinkCardAction
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  IAceMyLocationAdaptiveCardExtensionProps,
  IAceMyLocationAdaptiveCardExtensionState
} from '../AceMyLocationAdaptiveCardExtension';

export class CardView extends BaseImageCardView<
  IAceMyLocationAdaptiveCardExtensionProps,
  IAceMyLocationAdaptiveCardExtensionState
> {
  public get data(): IImageCardParameters { 
    // Get the raw description from properties or default to an empty string
  const rawDescription = this.properties.description || "";
  const fallbackLocationName = this.properties.defaultLocationName || "{placeholder Location Name}";

  // Replace the {Location} token with the actual location name (fallback if missing)
  const descriptionWithLocation = rawDescription.replace(
    /\{Location\}/gi, // regex to find all {Location} (case-insensitive)
    this.state.locationName || fallbackLocationName
  );

    return {
      title: this.properties.title,
      imageUrl: this.state.imageUrl || 'https://via.placeholder.com/300x200',
      primaryText: descriptionWithLocation,
      iconProperty: this.properties.fabricIconName || 'Home'
    };
  }

  public get onCardSelection(): IExternalLinkCardAction | undefined {
    const url = this.state.officeUrl || this.properties.defaultUrl;
    
    if (url) {
      return {
        type: 'ExternalLink',
        parameters: {
          target: url
        }
      };
    }
    return undefined;
  }
}

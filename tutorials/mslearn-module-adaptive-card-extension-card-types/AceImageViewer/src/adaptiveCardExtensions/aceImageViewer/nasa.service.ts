import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { HttpClient } from '@microsoft/sp-http';

export interface INasaImage {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  center: string;
  keywords: string[];
  thumbnailUrl: string;
  imageUrl: string;
}

interface INasaSearchItem {
  data: {
    nasa_id: string;
    title: string;
    description: string;
    date_created: string;
    center: string;
    keywords?: string[];
  }[];
  links?: { href: string }[];
}

export const searchImages = async (
  spContext: AdaptiveCardExtensionContext,
  query: string): Promise<INasaImage[]> => {
  const results: { collection: { items: INasaSearchItem[] } } = await (
    await spContext.httpClient.get(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`,
      HttpClient.configurations.v1
    )
  ).json();

  return results.collection.items
    .filter((item) => item.links && item.links.length > 0)
    .map((item) => {
      const data = item.data[0];
      const thumbnailUrl = item.links![0].href;
      return {
        nasaId: data.nasa_id,
        title: data.title,
        description: data.description,
        dateCreated: data.date_created,
        center: data.center,
        keywords: data.keywords || [],
        thumbnailUrl: thumbnailUrl,
        imageUrl: thumbnailUrl.replace('~thumb.jpg', '~orig.jpg')
      };
    });
}

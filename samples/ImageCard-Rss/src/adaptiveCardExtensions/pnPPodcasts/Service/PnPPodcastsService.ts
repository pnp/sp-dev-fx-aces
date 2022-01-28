import { HttpClient } from '@microsoft/sp-http';
import { PnPPodcasts, Channel, Image, ItemEntity } from '../models/PnPPodcasts';

export default class PnPPodcastsService {

  public getRSSContent = async (podcast: PnPPodcasts, httpClient: HttpClient): Promise<any> => {

    try {
      const response = await httpClient.get(
        `https://feed.podbean.com/pnpweekly/feed.xml`,
        HttpClient.configurations.v1);
      if (!response.ok) {
        const errorDetails = await response.text();
        console.log(errorDetails);
        return null;
      }

      let xmlStr = await response.text();
      let parser = new DOMParser();
      let xml = parser.parseFromString(String(xmlStr), "application/xml");
      let podcastJson: any = xml2json(xml);

      let items: ItemEntity[] = [];
      podcastJson.rss.channel.item.forEach(item => {
        let _itemEntity: ItemEntity = {
          title: item.title,
          link: item.link,
          description: item.description.replace(/(<([^>]+)>)/gi, ""),
          summary: item.title.replace("Microsoft 365 PnP Weekly - ", ""),
          duration: item["itunes:duration"],
          image: item["itunes:image"],
          enclosure: item.enclosure,
        } as ItemEntity;
        items.push(_itemEntity);
      });
      let image: Image = {
        url: podcastJson.rss.channel.image.url,
      };
      let channel: Channel = {
        title: podcastJson.rss.channel.title,
        link: podcastJson.rss.channel.link,
        image: image,
        item: items,
      };
      podcast = {
        channel: channel,
      };
      return podcast;
    } catch (error) {
      console.log(error);
      return null;
    }
    //Method from following answer in stackoverflow.
    //https://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript
    function xml2json(xml) {
      try {
        var obj = {};
        if (xml.children.length > 0) {
          for (var i = 0; i < xml.children.length; i++) {
            var item = xml.children.item(i);
            if (item.nodeName === "itunes:image") {
              item.textContent = item.attributes["href"].value;
            } else if (item.nodeName === "enclosure") {
              item.textContent = item.attributes["url"].value;
            }
            var nodeName = item.nodeName;

            if (typeof (obj[nodeName]) == "undefined") {
              obj[nodeName] = xml2json(item);
            } else {
              if (typeof (obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];

                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(xml2json(item));
            }
          }
        } else {
          obj = xml.textContent;
        }
        return obj;
      } catch (e) {
        console.log(e.message);
      }
    }
  }
}
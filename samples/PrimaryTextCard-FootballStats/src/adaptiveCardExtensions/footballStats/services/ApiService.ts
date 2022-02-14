import { HttpClient, HttpClientResponse, HttpClientConfiguration, IHttpClientOptions } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

export class ApiService {

  public static getStandingsByLeague = async (context: AdaptiveCardExtensionContext, leagueCode: string) => {
    let data: any;
    let url = `https://api.football-data.org/v2/competitions/${leagueCode}/standings`;
    let requestHeaders: Headers = new Headers();
    requestHeaders.append("X-Auth-Token", "bf4bb41b158c4e08a7399b7136dcb96d");
    let httpClientOptions: IHttpClientOptions = {
      headers: requestHeaders,
    };
    let response: HttpClientResponse = await context.httpClient.get(url, HttpClient.configurations.v1, httpClientOptions);
    if(response.ok)
    {
      data = await response.json();
    }
    else
    {
      let responseText:any = await response.text();
      console.log(`getStandingsByLeague() - ${responseText}`);
      data = {};
    }
    return data;
  }
}
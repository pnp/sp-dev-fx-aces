import { HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class ApiService {

  public static getStandingsByLeague = async (context: AdaptiveCardExtensionContext, leagueCode: string): Promise<any> => {
    let data: any;
    const url = `https://api.football-data.org/v2/competitions/${leagueCode}/standings`;
    const requestHeaders: Headers = new Headers();
    requestHeaders.append("X-Auth-Token", "bf4bb41b158c4e08a7399b7136dcb96d");
    const httpClientOptions: IHttpClientOptions = {
      headers: requestHeaders,
    };
    const response: HttpClientResponse = await context.httpClient.get(url, HttpClient.configurations.v1, httpClientOptions);
    if(response.ok)
    {
      data = await response.json();
    }
    else
    {
      const responseText:any = await response.text();
      console.log(`getStandingsByLeague() - ${responseText}`);
      data = {};
    }
    return data;
  }
}
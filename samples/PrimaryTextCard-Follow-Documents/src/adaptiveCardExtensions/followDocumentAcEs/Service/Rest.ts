import {
    SPHttpClient,
    SPHttpClientResponse,
    ISPHttpClientOptions,
  } from "@microsoft/sp-http";

  export default class Rest {
    public async stopfollowing(
        spHttpClient: SPHttpClient,
        fileUrl: string,
        siteUrl: string
      ): Promise<boolean> {
        const spOpts: ISPHttpClientOptions = {
          headers: {
            Accept: "application/json;odata.metadata=minimal",
            "Content-type": "application/json;odata=verbose",
          },
          body: `{'actor': { 'ActorType':1, 'ContentUri':'${fileUrl}', 'Id':null}}`,
        };
        const value = await spHttpClient
          .post(
            `${siteUrl}/_api/social.following/stopfollowing`,
            SPHttpClient.configurations.v1,
            spOpts
          )
          .then((response: SPHttpClientResponse) => {
            // Access properties of the response object.
            console.log(`Status code: ${response.status}`);
            console.log(`Status text: ${response.statusText}`);
            return true;
          });
        return value;
      }
}
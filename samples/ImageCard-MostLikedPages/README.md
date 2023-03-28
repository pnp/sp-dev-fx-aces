# Most Liked Pages

## Summary

This Adaptive Card Extension shows the most liked pages of selected SharePoint sites.

![Demo1](./assets/cards-preview.png)

![Demo2](./assets/cards-preview-details.png)

![Demo3](./assets/action-demo.gif)

## Compatibility

![SPFx](https://img.shields.io/badge/SPFx-1.16.1-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-LTS%2016.x-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)

## Permissions

Microsoft Graph

- Sites.Read.All

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> `Sites.Read.All` permission to be approved after uploading the package

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| Most Liked Pages | [Aimery Thomas](https://github.com/a1mery), [@aimery_thomas](https://twitter.com/aimery_thomas) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | March 15, 2023 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Deploy the package (image-card-most-liked-pages.sppkg) to the tenant app catalogue.
- The solution needs following Microsoft Graph API permissions. Approve the API access requests in the SharePoint admin center.

  | Permissions               |
  |---------------------------|
  | Sites.Read.All |

- Add the ACE **Most Liked Pages** to the Dashboard.

## Features

Displays the top 10 most liked pages among a list of selected SharePoint sites (through the property pane).

This adaptive card extension illustrates the following concepts:

- Use of the SharePoint Pages Microsoft Graph API
- Use of PropertyFieldSitePicker control from [@pnp/spfx-property-controls](https://pnp.github.io/sp-dev-fx-property-controls/)

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Build your first SharePoint Adaptive Card Extension](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/get-started/build-first-sharepoint-adaptive-card-extension)
- [Designing Viva Connections custom cards for your dashboard](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/design/design-intro)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/ImageCard-MostLikedPages" />

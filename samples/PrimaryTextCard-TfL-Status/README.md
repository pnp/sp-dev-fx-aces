# Transport for London Status

## Summary

This example shows how to build an ACE with multiple card and quick views to get display status of Transport for London services.

The sample also allows user to mark a train line as their favourite and that data is saved against the user as open extensions using Microsoft Graph.

### Highlights

- Getting data using HttpClient
- Using MS Graph for open extensions
- Usage of SVG with multiple colours
- Theme based display

### Demo

#### Viva connections app (preview)

![demo](./assets/demo_mobile_app.gif)

#### Dashboard in the home site

![demo](./assets/demo.gif)

## Used SharePoint Framework Version

![SPFx 1.17.0](https://img.shields.io/badge/SPFx-1.17.0-green.svg)
![Node.js LTS v16](https://img.shields.io/badge/Node.js-LTS%20v16-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)
![Workbench Hosted](https://img.shields.io/badge/Workbench-Hosted-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> None

## Solution

Solution|Author(s)
--------|---------
tfl-status | [Anoop Tatti](https://github.com/anoopt) ([https://linktr.ee/anoopt](https://linktr.ee/anoopt))

## Details related to favourite tube line

The sample makes use of `open extensions` to store user's favourite tube line. The code related to open extensions is present in the file `tfl.ts`.

### Creating open extension

Once the property of the ACE (`favLineExtensionName`) is set, the code first checks if an open extension with that name exists for the user. If not, the code creates an open extension using Microsoft Graph. The permission needed for this is `User.ReadWrite` and the Graph endpoint is `/me/extensions`.

### Updating open extension

When a user marks a tube line as their favourite, the code updates the open extension with the ID of the line marked as favourite. The permission needed for this is `User.ReadWrite` and the Graph endpoint is `/me/extensions`.

## Version history

Version|Date|Comments
-------|----|--------
1.0|September 09, 2021|Initial release
1.1|November 1, 2021|Updated to SPFx 1.13.0, Minor UI updates
1.2|June 16, 2023|Updated to SPFx 1.17.2

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
- After that create the sppkg file using
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Deploy the package to the app catalogue site in your tenant
- The solution needs `User.ReadWrite` permission of Microsoft Graph API. So, approve the API access request in the SharePoint admin center
- in the command-line run:
  - **gulp serve -l --nobrowser**
- or if using spfx-fast-serve, in the command-line run:
  - **npm run serve**
- Open the workbench page (<https://tenantname.sharepoint.com/sites/sitename/_layouts/15/workbench.aspx>)
- Add the ACE to the page
- Edit the properties of ACE to include the name of an open extension (e.g. `com.tenantname.favline`)

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
- [Tutorial to create ACE](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/get-started/build-first-sharepoint-adaptive-card-extension)

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/PrimaryTextCard-Tfl-Status" />

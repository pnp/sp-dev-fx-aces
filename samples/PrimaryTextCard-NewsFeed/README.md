# News Adaptive Card Extension

## Summary

Shows a count of SP news articles in the last 30 days and a quick view of those articles

![Screenshot of the Viva News Feed Card](./assets/Screenshot-2022-04-27-095421.png "Viva News Feed Card")

## Compatibility

![SPFx 1.14](https://img.shields.io/badge/SPFx-1.14.0-green.svg)
![PnPJS 3.2.0](https://img.shields.io/badge/PnPjs-3.2.0-green.svg)
![Node.js LTS 14.x](https://img.shields.io/badge/Node.js-LTS%2014.x-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)
![Teams N/A: Untested with Microsoft Teams](https://img.shields.io/badge/Teams-N%2FA-lightgrey.svg "Untested with Microsoft Teams")
![Workbench Local | Hosted](https://img.shields.io/badge/Workbench-Local%20%7C%20Hosted-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Solution

Solution|Author(s)
--------|---------
PrimaryTextCard-NewsFeed | Nick Brown ([@teckienickb](https://twitter.com/teckienickb)), [Jisc](https://www.jisc.ac.uk)

## Version history

Version|Date|Comments
-------|----|--------
1.0|April 26, 2022|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**
  - **Add to workbench**
- You may need to ./assets to ./sharepoint/assets for the icon to compile correctly.

## Features

Loads the latest news from the SharePoint api for the past 30 days and displays a count and quick view

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/PrimaryTextCard-NewsFeed" />

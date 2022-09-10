# BasicCard-ShareGraphClient

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.15-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| graph-client-library | [Marcin Wojciechowski](https://github.com/mgwojciech) [@mgwojciech](https://twitter.com/mgwojciech) |
| shared-docs-ace | [Marcin Wojciechowski](https://github.com/mgwojciech) [@mgwojciech](https://twitter.com/mgwojciech) |
| trending-docs-ace | [Marcin Wojciechowski](https://github.com/mgwojciech) [@mgwojciech](https://twitter.com/mgwojciech) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | September 17, 2022 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Navigate to graph-client-library
- in the command-line run:
  - **npm install**
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
  - **npm link**
- Upload package to app catalog
- Navigate to shared-docs-ace
- in the command-line run:
  - **npm install**
  - **npm link graph-client-library**
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Upload package to app catalog
- Navigate to trending-docs-ace
- in the command-line run:
  - **npm install**
  - **npm link graph-client-library**
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Upload package to app catalog
- Go to your home site and open Dashboard.aspx
- Add Documents shared ACE
- Add Trending documents ACE
- Enjoy batching between sp packages!

## Features

This sample showcases how we can reuse single graph client between multiple aces placed in different solutions. On top of that we will use auto-batching to limit the number of requests.

Core of this solution is GraphClientProvider class which is exposed by spfx library component (graph-client-library). The trick here is to use SPFx ServiceScope to get AadHttpClient, pass it to BatchHttpClient and store our client as a private property in provider class. We will also register our GraphClientProvider in ServiceScope so we can share the instance between extensions.

In our ACEs we will consume the GraphClientProvider and get the actual http client. As we are now sharing one instance of graph client, we can take advantage of batching between different ACEs provided by different sppkg. 

I did not implement any UI layer as this particular sample has nothing to do with any UI. What You can notice, is when You open Dashboard.aspx and You have both ACEs added, there will be only one batch call to MS Graph API instead of two.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
- [Build solutions with the library component type in SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/library-component-tutorial)

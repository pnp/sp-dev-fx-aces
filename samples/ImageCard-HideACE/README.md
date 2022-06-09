# hide-ace

## Summary

This solution shows how to hide an ACE based on user interactions. It shows a form asking for user data. When the user submits the form it stores the date and time in localstorage. When the ACE renders it checks the value and compares it against a configurable value for expiration time. The times are checked against the value in localstorage and if the expiration has passed the form shows. If the expiration has not then the form is hidden.

![Example](./assets/demo.gif)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.14-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Solution

Solution|Author(s)
--------|---------
hide-ace| Derek Cash-Peterson ([@spdcp](https://twitter.com/spdcp)) Sympraxis Consulting

## Version history

Version|Date|Comments
-------|----|--------
1.0|March 24, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure all pre-requisites are met
- Ensure that you are at the solution folder
- in the command line run:
  - `npm install`
  - `gulp serve`

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/ImageCard-HideACE" />

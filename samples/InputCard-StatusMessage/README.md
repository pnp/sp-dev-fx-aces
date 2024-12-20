# InputCard-StatusMessage

## Summary

This Adaptive Card Extension let you set your presence status message directly from the card view.

Default view of the card:

![DefaultView](./assets/DefaultView.png)

Validation message:

![ValidationMessage](./assets/ValidationMessage.png)

Demo:

![Demo](./assets/StatusMessageGif.gif)


## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.20.0-green.svg)
![Node.js LTS 18.x](https://img.shields.io/badge/Node.js-LTS%2018.x-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> `Presence.ReadWrite` permission to be approved after uploading the package

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| InputCard-StatusMessage | [Aimery Thomas](https://github.com/a1mery), [@aimery_thomas](https://twitter.com/aimery_thomas) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | October 07, 2023 | Initial release |
| 1.1     | December 20, 2024 | Upgrade to SPFx 1.20 |

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
- Deploy the package (input-card-status-message.sppkg) to the tenant app catalogue.
- The solution needs following Microsoft Graph API permissions. Approve the API access requests in the SharePoint admin center.

  | Permissions               |
  |---------------------------|
  | Presence.ReadWrite |

- Add the ACE **Set Status Message** to the Dashboard.

## Features

This sample demonstrates how to use new SPFx v1.18 ACE feature to add text input in the card and use it to set presence status message.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
- [BasicCard-StatusMessage](https://github.com/pnp/sp-dev-fx-aces/tree/main/samples/BasicCard-StatusMessage#basiccard-statusmessage)

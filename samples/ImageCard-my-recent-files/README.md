# My Recent Files

## Summary

This Adaptive Card Extension allows user quick access recent files

This ACE, use Microsoft Graph API and needs the user approve the required permissions, after they have added the app to app catalog.

![ace-my-recent-files](./src/assets/my-recent-files01.png)

![ace-my-recent-files](./src/assets/my-recent-files02.png)

## Compatibility

![SPFx 1.23.0](https://img.shields.io/badge/SPFx-1.23.0-green.svg)
![Node.js v22](https://img.shields.io/badge/Node.js-v22.14%2B-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)
![Teams N/A: Untested with Microsoft Teams](https://img.shields.io/badge/Teams-N%2FA-lightgrey.svg "Untested with Microsoft Teams")
![Workbench Local | Hosted](https://img.shields.io/badge/Workbench-Local%20%7C%20Hosted-green.svg)

## Permissions

Microsoft Graph

- Files.Read

## Applies to

- [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
- [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)

## Prerequisites

This ACE need Microsoft Graph Permissions:

- Files.Read

## Solution

| Solution             | Author(s)                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| ACE-MY-RECENT-FILES | [João Mendes](https://github.com/joaojmendes) ([@joaojmendes](https://twitter.com/joaojmendes)), VALO Solutions Ltd |

## Version history

| Version | Date              | Comments                                                        |
| ------- | ----------------- | --------------------------------------------------------------- |
| 1.0     | April 12, 2022    | Initial release                                                 |
| 1.1     | July 31, 2026     | Upgraded to SPFx 1.23.0 |

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder

  - in the command line run:
    - `npm install`
    - `npm run build`
    - Browse to your SharePoint app catalog and load the generated SPFx package (`sharepoint/solution/spfx-ace-my-recent-files.sppkg`).
    - Browse to your SharePoint Admin Center and under advanced you will need to open Api Access and allow the requests for Microsoft Graph.

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/ImageCard-my-recent-files" />

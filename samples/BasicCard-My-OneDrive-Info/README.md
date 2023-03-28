# BasicCard-My-OneDrive-Info

## Summary

Viva Connection Adaptive Card Extension (ACE) that

1. Shows the users OneDrive quota/space utilized in card view
2. Shows other details like Web URL, last modified time, state, remaining size in quick view

Card view

![ACE in action](./assets/ACEScreenshot1.png)

Property pane

![ACE Properties](./assets/ACEScreenshot2.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.16.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites

After deploying the solution to tenant app catalog, SharePoint administrator needs to approve the Graph API permissions from SharePoint admin center > Advanced > API access blade.

You need following set of permissions. Find out more about consuming the [Microsoft Graph API in the SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aad-tutorial)

```
"webApiPermissionRequests": [
  {
    "resource": "Microsoft Graph",
    "scope": "Files.Read"
  }
]
```

## Solution

| Solution         | Author(s)                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| My OneDrive Info | [Harminder Singh](https://github.com/HarminderSethi) <https://www.linkedin.com/in/harmindersinghsethi/> |

## Version history

| Version | Date              | Comments        |
| ------- | ----------------- | --------------- |
| 1.0     | February 21, 2023 | Initial Release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
- Create the solution package (.sppkg file) using:
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Deploy the package (basic-card-my-one-drive-info.sppkg) to the tenant app catalogue.
- The solution needs following Microsoft Graph API permissions. Approve the API access requests in the SharePoint admin center.

  | Permissions |
  | ----------- |
  | Files.Read  |

- in the command-line run:
  - **gulp serve -l --nobrowser**
- Open the workbench page (<https://tenantname.sharepoint.com/sites/sitename/_layouts/15/workbench.aspx>)
- Add the ACE named **myOneDriveInfo** to the page.

## Features

This extension illustrates the following concepts:

- Shows the user OneDrive quota/space utilized in card view
- Shows other details like Web URL, last modified time, state, remaining size in quick view

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Build your first SharePoint Adaptive Card Extension](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/get-started/build-first-sharepoint-adaptive-card-extension)
- [Designing Viva Connections custom cards for your dashboard](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/design/design-intro)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/BasicCard-My-OneDrive-Info" />

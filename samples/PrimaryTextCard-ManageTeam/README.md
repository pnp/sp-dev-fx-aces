# Display and Manage Team

## Summary

This sample shows how to manage a team using the Adaptive Card Extension (ACE).

The following are scenarios covered by this sample.

- Display all team members who directly reports to me using the Microsoft Graph API in the Card view along with two buttons.

    ![Card view with team members information](assets/ACEs2.gif)

- Display details about a user with a click on the Card view. The corresponding information will display on the Quick view component of the ACE.

    ![employee information in Quick view](assets/ACEs3.gif)

- Change the block sign-in property when the user chooses the **Block Sign-In** button in the Quick view.

    ![Block Sign In](assets/ACEs4.gif)

## Compatibility

![SPFx 1.13](https://img.shields.io/badge/SPFx-1.13.0-green.svg)
![Node.js LTS 14.x](https://img.shields.io/badge/Node.js-LTS%2014.x-green.svg)
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-yellow.svg)
![Teams N/A: Untested with Microsoft Teams](https://img.shields.io/badge/Teams-N%2FA-lightgrey.svg "Untested with Microsoft Teams")
![Workbench Local | Hosted](https://img.shields.io/badge/Workbench-Local%20%7C%20Hosted-green.svg)

## Applies to

* [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
* [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)
* [SharePoint Adaptive Card Extension](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/get-started/build-first-sharepoint-adaptive-card-extension)
* [Consume the Microsoft Graph in the SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aad-tutorial)

## Prerequisites

After deploying the solution to the app catalog, a SharePoint administrator needs to approve the Microsoft Graph API permissions from SharePoint admin center > Advanced > API access, which gives the solution access to team members and supports the handling of block sign-in.

![Approve API Permission from Admin ](assets/ACEs1.png)

## Solution

| Solution   | Author(s)                                                                                                                     |
|------------|-------------------------------------------------------------------------------------------------------------------------------|
| ManageTeam | [Dipen Shah](https://github.com/Dips365) [@Dips365](https://twitter.com/Dips_365) [Rapid Circle](https://en.rapidcircle.com/) |

## Version history

| Version | Date               | Comments       |
|---------|--------------------|----------------|
| 1.0     | September 20, 2021 | Initial Commit |

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal path to awesome

* Clone this repository
* in the command line run:
  * `npm install`
  * `gulp serve`

## Features

This Adaptive Card Extension illustrates the following concepts on top of the SharePoint Framework:

* Introduction on ACEs
* Microsoft Graph API integration
* Handle queries on Quick View

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-aces/samples/PrimaryTextCard-ManageTeam" />

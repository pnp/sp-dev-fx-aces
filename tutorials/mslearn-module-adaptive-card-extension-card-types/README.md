# Create Adaptive Card Extensions (ACE) for Microsoft Viva Connections

## Summary

SharePoint Framework (SPFx) Adaptive Card Extensions (ACEs) for Microsoft Viva Connections that use the basic card and image card templates, QuickViews, and the Viva Connections geolocation actions. This tutorial contains the completed code for the exercises in the Microsoft Learn module [Create Adaptive Card Extensions (ACE) for Microsoft Viva Connections](https://learn.microsoft.com/training/modules/sharepoint-spfx-adaptive-card-extension-card-types/).

Each exercise in the module builds its own project. Each project folder contains the completed solution for its exercise. When an exercise builds on an earlier one, the `checkpoints` folder in the project contains the code as it was at the end of that earlier exercise.

| Folder | Microsoft Learn exercise | What it shows |
|---|---|---|
| [AceSharePointRest](AceSharePointRest/README.md) | Create SPFx Basic Card ACE showing SharePoint list data | Basic card ACE that shows and adds items in a SharePoint list. |
| [AceImageViewer](AceImageViewer/README.md) | Create a SPFx Image Card ACE displaying image carousel | Image card ACE that shows images from the NASA Image REST API. |
| [AceCampusShuttle](AceCampusShuttle/README.md) | Create a SPFx ACE with geo-location capabilities | ACE that manages a campus shuttle trip with the Viva Connections geolocation actions. |

![SharePoint REST card QuickView cycling through list items on the Dashboard page](assets/preview-acesharepointrest.png)

![AceImageViewer QuickView showing a NASA image with its details](assets/preview-aceimageviewer.png)

![Campus Shuttle card with the Complete Trip confirmation QuickView](assets/preview-acecampusshuttle.png)

## Compatibility

| :warning: Important          |
|:---------------------------|
| Every SPFx version is optimally compatible with specific versions of Node.js. In order to be able to Toolchain this sample, you need to ensure that the version of Node on your workstation matches one of the versions listed in this section. This sample will not work on a different version of Node.|
|Refer to <https://aka.ms/spfx-matrix> for more information on SPFx compatibility.   |

This tutorial is optimally compatible with the following environment configuration:

![SPFx 1.24.1](https://img.shields.io/badge/SPFx-1.24.1-green.svg)
![Node.js v22 | v24 | v26](https://img.shields.io/badge/Node.js-v22%20%7C%20v24%20%7C%20v26-green.svg)
![Toolchain: Heft](https://img.shields.io/badge/Toolchain-Heft-green.svg)
![Compatible with SharePoint Online](https://img.shields.io/badge/SharePoint%20Online-Compatible-green.svg)
![Does not work with SharePoint 2019](https://img.shields.io/badge/SharePoint%20Server%202019-Incompatible-red.svg "SharePoint Server 2019 requires SPFx 1.4.1 or lower")
![Does not work with SharePoint 2016 (Feature Pack 2)](https://img.shields.io/badge/SharePoint%20Server%202016%20(Feature%20Pack%202)-Incompatible-red.svg "SharePoint Server 2016 Feature Pack 2 requires SPFx 1.1")
![Local Workbench Unsupported](https://img.shields.io/badge/Local%20Workbench-Unsupported-red.svg "Local workbench is no longer available as of SPFx 1.13 and above")
![Hosted Workbench Compatible](https://img.shields.io/badge/Hosted%20Workbench-Compatible-green.svg)

## Applies to

* [SharePoint Framework](https://learn.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
* [Microsoft 365 tenant](https://learn.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment)
* [Microsoft Viva Connections](https://learn.microsoft.com/viva/connections/viva-connections-overview)
* [Microsoft Learn: Create Adaptive Card Extensions (ACE) for Microsoft Viva Connections](https://learn.microsoft.com/training/modules/sharepoint-spfx-adaptive-card-extension-card-types/)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](https://aka.ms/m365/devprogram)

## Contributors

* [Andrew Connell](https://github.com/andrewconnell)
* [Andrew Connell](https://github.com/andrewconnell-msft3)

## Version history

|Version|Date|Comments|
|-------|----|--------|
|1.0|November 24, 2026|Initial release|

## Prerequisites

* A SharePoint Online site with a Viva Connections **Dashboard** page to test the ACEs on

For the **AceSharePointRest** project:

* A list named **Launch Milestones** with a **Description** text column, and its list ID

For the **AceCampusShuttle** project:

* The **Campus Shuttle** list that the exercise creates, and its list ID
* Browser access to your location

## Minimal path to awesome

* Clone this repository, or [download this tutorial as a .ZIP file](https://pnp.github.io/download-partial/?url=https://github.com/pnp/sp-dev-fx-aces/tree/main/tutorials/mslearn-module-adaptive-card-extension-card-types) and unzip it.
* From your command line, change to the folder of the project you want to run, under `tutorials/mslearn-module-adaptive-card-extension-card-types`.
* Ensure that you're using a supported Node.js version. If you use nvm, run `nvm use`.
* In `config/serve.json`, replace the page URL (`initialPage`, or `pageUrl` for extensions) with a page in a site you can test on. Set the `SPFX_SERVE_TENANT_DOMAIN` environment variable to your SharePoint Online domain, for example `contoso.sharepoint.com`.
* In the command line, run:
  * `npm install`
  * `npm run start`
* To build a deployable package, run `npm run build`. The package is saved in the `sharepoint/solution` folder.

## Features

This tutorial illustrates the following concepts on top of the SharePoint Framework:

* Basic card and image card ACE templates
* QuickViews and view navigation
* Reading and adding SharePoint list items with the SharePoint REST API
* Calling the NASA Image REST API from an ACE
* Using the `VivaAction.GetLocation` and `VivaAction.ShowLocation` actions

## Help

We do not support samples, but this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for community members to volunteer their time and help resolve issues.

If you're having issues building the solution, please run [spfx doctor](https://pnp.github.io/cli-microsoft365/cmd/spfx/spfx-doctor/) from within the solution folder to diagnose incompatibility issues with your environment.

You can try looking at [issues related to this tutorial](https://github.com/pnp/sp-dev-fx-aces/issues?q=label%3A%22sample%3A%20mslearn-module-adaptive-card-extension-card-types%22) to see if anybody else is having the same issues.

You can also try looking at [discussions related to this tutorial](https://github.com/pnp/sp-dev-fx-aces/discussions?discussions_q=mslearn-module-adaptive-card-extension-card-types) and see what the community is saying.

If you encounter any issues using this tutorial, [create a new issue](https://github.com/pnp/sp-dev-fx-aces/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected%2Csample%3A%20mslearn-module-adaptive-card-extension-card-types&template=bug-report.yml&sample=mslearn-module-adaptive-card-extension-card-types&authors=@andrewconnell%20@andrewconnell-msft3&title=mslearn-module-adaptive-card-extension-card-types%20-%20).

For questions regarding this tutorial, [create a new question](https://github.com/pnp/sp-dev-fx-aces/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Aquestion%2Csample%3A%20mslearn-module-adaptive-card-extension-card-types&template=question.yml&sample=mslearn-module-adaptive-card-extension-card-types&authors=@andrewconnell%20@andrewconnell-msft3&title=mslearn-module-adaptive-card-extension-card-types%20-%20).

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/sp-dev-fx-aces/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Aenhancement%2Csample%3A%20mslearn-module-adaptive-card-extension-card-types&template=suggestion.yml&sample=mslearn-module-adaptive-card-extension-card-types&authors=@andrewconnell%20@andrewconnell-msft3&title=mslearn-module-adaptive-card-extension-card-types%20-%20).

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

<img src="https://m365-visitor-stats.azurewebsites.net/sp-dev-fx-aces/tutorials/mslearn-module-adaptive-card-extension-card-types" />

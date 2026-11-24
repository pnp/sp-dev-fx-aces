# AceSharePointRest

Basic card ACE that shows and adds items in a SharePoint list.

This project is the completed solution for the exercise **Create SPFx Basic Card ACE showing SharePoint list data** in the Microsoft Learn module [Create Adaptive Card Extensions (ACE) for Microsoft Viva Connections](https://learn.microsoft.com/training/modules/sharepoint-spfx-adaptive-card-extension-card-types/). For compatibility, prerequisites, and help, see the [tutorial README](../README.md).

![SharePoint REST card QuickView cycling through list items on the Dashboard page](../assets/preview-acesharepointrest.png)

## Prerequisites

* A list named **Launch Milestones** with a **Description** text column, and its list ID

## Minimal path to awesome

* Clone this repository, or [download this tutorial as a .ZIP file](https://pnp.github.io/download-partial/?url=https://github.com/pnp/sp-dev-fx-aces/tree/main/tutorials/mslearn-module-adaptive-card-extension-card-types) and unzip it.
* From your command line, change to the `tutorials/mslearn-module-adaptive-card-extension-card-types/AceSharePointRest` folder.
* Ensure that you're using a supported Node.js version. If you use nvm, run `nvm use`.
* In `config/serve.json`, replace the page URL (`initialPage`, or `pageUrl` for extensions) with a page in a site you can test on. Set the `SPFX_SERVE_TENANT_DOMAIN` environment variable to your SharePoint Online domain, for example `contoso.sharepoint.com`.
* In the command line, run:
  * `npm install`
  * `npm run start`
* To build a deployable package, run `npm run build`. The package is saved in the `sharepoint/solution` folder.

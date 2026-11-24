# AceImageViewer

Image card ACE that shows images from the NASA Image REST API.

This project is the completed solution for the exercise **Create a SPFx Image Card ACE displaying image carousel** in the Microsoft Learn module [Create Adaptive Card Extensions (ACE) for Microsoft Viva Connections](https://learn.microsoft.com/training/modules/sharepoint-spfx-adaptive-card-extension-card-types/). For compatibility, prerequisites, and help, see the [tutorial README](../README.md).

![AceImageViewer QuickView showing a NASA image with its details](../assets/preview-aceimageviewer.png)

## Minimal path to awesome

* Clone this repository, or [download this tutorial as a .ZIP file](https://pnp.github.io/download-partial/?url=https://github.com/pnp/sp-dev-fx-aces/tree/main/tutorials/mslearn-module-adaptive-card-extension-card-types) and unzip it.
* From your command line, change to the `tutorials/mslearn-module-adaptive-card-extension-card-types/AceImageViewer` folder.
* Ensure that you're using a supported Node.js version. If you use nvm, run `nvm use`.
* Set the `SPFX_SERVE_TENANT_DOMAIN` environment variable to your SharePoint Online domain, for example `contoso.sharepoint.com`. If `config/serve.json` contains `<site-name>` or a site path, change it to a site you can test on.
* In the command line, run:
  * `npm install`
  * `npm run start`
* To build a deployable package, run `npm run build`. The package is saved in the `sharepoint/solution` folder.

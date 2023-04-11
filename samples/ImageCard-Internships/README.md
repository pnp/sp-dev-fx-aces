### Summary
This sample shows how to build an ACE with a card view and quick view to display new and recent internships available to gain work experience.

![Internships.png](./assets/Internships.gif)

### Used SharePoint Framework Version
*Version 1.16.0*

### Applies to
-   [SharePoint Framework](https://aka.ms/spfx)
-   [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram).

### Version history

| **Version** | **Date** | **Comments** |
|--|--|--|
| 1.0  | April 14, 2023 | Initial release |

### Disclaimer
**This code is provided** _**as is**_ **without warranty of any kind, either express or implied, including any implied warranties of fitness for a particular purpose, merchantability, or non-infringement.**

### Minimal Path to Awesome
-   Clone this repository
-   Ensure that you are at the solution folder
-   Replace the dummy data from JSON file with actual data. This data can be found under src\adaptiveCardExtensions\intern\models\quick-view-sample-data.json
-   Make sure to install ESLint by running the following command npm i -D gulp-eslint-new
-   In the command line run:
    - `npm install`
      - `gulp build --ship`
      - `gulp bundle --ship`
      - `gulp package-solution --ship`
    - Browse to your SharePoint app catalog and load the SPFx package.
    - To test in the workbench use
        - gulp serve --nobrowser

### References

 - [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
 - [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
 - [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
 - [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
 - [Tutorial to create ACE](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/get-started/build-first-sharepoint-adaptive-card-extension)
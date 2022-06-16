# Viva Connection Adaptive Card Extensions (ACEs) sample repository

Repository for the Viva Connections Viva Adaptive Card (ACE) sample solutions from Microsoft and community. ACEs are build using [SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections). This repository contains community samples that demonstrate different usage patterns for the SharePoint Framework client-side web parts.

> We do welcome community contributions to the samples folder in this repository for demonstrating different use cases with SharePoint Framework. Notice that if you use 3rd party libraries, please make sure that library license allows distributions of it as part of your sample.

Viva Connections Adaptive Card Extensions are cards that can be exposed through the Viva Connections Desktop or Mobile experiences. They're the building blocks of pages that appear on a SharePoint site.

## Have issues or questions?

Please use following logic on submitting your questions or issues to right location to ensure that they are noticed and addressed as soon as possible.

* You have general question or challenge with SPFx - use [sp-dev-docs repository issue list](https://github.com/SharePoint/sp-dev-docs/issues).
* You have issue on specific web part or sample - use [issue list in this repository](https://github.com/pnp/sp-dev-fx-aces/issues).

## Additional resources

* [Getting started on building extensibility for Viva Connections](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections)
* [Microsoft Learn: Extend Microsoft Viva Connections](https://docs.microsoft.com/en-us/learn/paths/m365-extend-viva-connections/)
* [Overview of the SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
* [SharePoint Framework development tools and libraries](https://docs.microsoft.com/sharepoint/dev/spfx/tools-and-libraries)
* [Getting Started](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Using the samples

To build and start using these projects, you'll need to clone and build the projects.

Clone this repository by executing the following command in your console:

```shell
git clone https://github.com/pnp/sp-dev-fx-aces.git
```

Navigate to the cloned repository folder which should be the same as the repository name:

```shell
cd sp-dev-fx-aces
```

To access the samples use the following command, where you replace `sample-folder-name` with the name of the sample you want to access.

```shell
cd samples
cd sample-folder-name
```

Now run the following command to install the npm packages:

```shell
npm install
```

This will install the required npm packages and dependencies to build and run the client-side project.

Once the npm packages are installed, run the following command to preview your web parts in SharePoint Workbench:

```shell
gulp serve
```

## Authors

This repository's contributors are all community members who volunteered their time to share code samples. Work is done as an open source community project, with each sample contained in their own solution.

## Contributions

These samples are direct from the feature teams, Microsoft 365 platform community team (http://aka.ms/m365/community) or shared by the community. We welcome your input on issues and suggestions for new samples. We do also welcome community contributions around the client-side web parts. If you have any questions, just let us know.

Please have a look on our [Contribution Guidance](./CONTRIBUTING.md) before submitting your pull requests, so that we can get your contribution processed as fast as possible.

## Code of Conduct

This repository has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

> Sharing is caring!

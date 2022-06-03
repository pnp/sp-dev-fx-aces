import { formatDistanceToNow } from 'date-fns';

import { DriveItem } from '@microsoft/microsoft-graph-types';
import { BaseComponentContext } from '@microsoft/sp-component-base';

import { IFiles } from '../models/IFiles';
import utilities from '../utils/utils';

export class Services {
  private _context: BaseComponentContext = undefined;
  private _msGraphClient = undefined;
  constructor(context: BaseComponentContext) {
    this._context = context;
  }
  public init = async () => {
    this._msGraphClient = await this._context.msGraphClientFactory.getClient();
  }

  public getSiteInfo = async (siteId: string): Promise<any> => {

    try {
      if (!this._msGraphClient || siteId) return;

      const siteResults = await this._msGraphClient
        .api(`/sites/${siteId}`)
        .select("displayName")
        .get();
      return siteResults;
    } catch (error) {
      throw error;
    }
  }

  public getDriveInfo = async (driveId: string): Promise<any> => {
      try {
        if (!this._msGraphClient ||!driveId) return;

        const driveResults = await this._msGraphClient
          .api(`/drives/${driveId}`)
          .select("name")
          .get();
        return driveResults;
      } catch (error) {
        throw error;
      }
  }

  public getRecentFiles = async (): Promise<DriveItem[]> => {
    try {
      if (!this._msGraphClient) return;
      const siteResults = await this._msGraphClient.api(`/me/drive/recent`).top(15).get();
      return siteResults.value;
    } catch (error) {
      throw error;
    }
  }

  public getFiles = async (): Promise<IFiles[]> => {
    try {
      const files: DriveItem[] = await this.getRecentFiles();
      const listOfFiles: IFiles[] = [];
      for (const file of files) {
        const fileIcon = await utilities.GetFileImageUrl(file.name);
        const isOnDrive = await utilities.isOndrive(file.webUrl);
        let fileLocation = "";
        if (isOnDrive) {
          fileLocation = `OnDrive > ${ this._context.pageContext.user.displayName }`;
        } else {
          const siteInfo = await this.getSiteInfo(file.remoteItem.sharepointIds.siteId);
          const driveInfo = await this.getDriveInfo(file.remoteItem.parentReference.driveId);
          fileLocation = `${siteInfo?.displayName} > ${driveInfo?.name}`;
        }

        listOfFiles.push({
          ...file,
          fileLocation: fileLocation,
          name: utilities.getShortName(file.name),
          fileIcon,
          lastModifiedDateString: formatDistanceToNow(new Date(file.lastModifiedDateTime), { addSuffix: true }),
        });
      }
      return listOfFiles;
    } catch (error) {
      throw error;
    }
  }
}

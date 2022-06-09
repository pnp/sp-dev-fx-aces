import { DriveItem } from '@microsoft/microsoft-graph-types';

export interface IFiles extends DriveItem {
  fileLocation: string;
  fileIcon: string;
  lastModifiedDateString: string;
}

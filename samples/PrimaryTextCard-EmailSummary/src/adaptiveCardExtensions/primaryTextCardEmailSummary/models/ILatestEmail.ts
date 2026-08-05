export interface ILatestEmail {
  id: string;
  subject: string;
  fromName: string;
  fromAddress: string;
  receivedDateTime: string;
  bodyPreview: string;
  // Plain-text body used for Copilot summarization; bodyPreview is retained for UI display.
  bodyText: string;
  webLink: string;
}

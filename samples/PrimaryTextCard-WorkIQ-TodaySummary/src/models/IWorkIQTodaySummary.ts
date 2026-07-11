// Wire contract returned by the WorkIQ-TodaySummary-Proxy Azure Function.
// Keep this in sync with api/WorkIQTodaySummaryFunction/Models/TodaySummaryResponse.cs.

export type WorkIQReferencedItemType = 'file' | 'meeting' | 'message' | 'other';

export interface IWorkIQReferencedItem {
  id: string;
  type: WorkIQReferencedItemType;
  title: string;
  subtitle?: string;
  webUrl?: string;
}

export interface IWorkIQTodaySummaryResponse {
  headline: string;
  generatedAt: string;
  items: IWorkIQReferencedItem[];
  fromCache: boolean;
}

// UI-facing state. 'not-enabled' is split out from 'error' because it's the
// most likely first-run failure mode (tenant/user not licensed or consented
// for Work IQ yet) and deserves a distinct, actionable message in the card.
export type SummaryStatus = 'loading' | 'ready' | 'error' | 'not-enabled';

export interface ISummaryState {
  status: SummaryStatus;
  headline?: string;
  generatedAt?: string;
  items?: IWorkIQReferencedItem[];
  errorMessage?: string;
}

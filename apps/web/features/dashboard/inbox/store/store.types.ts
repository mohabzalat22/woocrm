import type { InboxActionSlice } from "./slices/inbox-action-slice";
import type { InboxUiSlice } from "./slices/inbox-ui-slice";

export type InboxStore = InboxUiSlice & InboxActionSlice;

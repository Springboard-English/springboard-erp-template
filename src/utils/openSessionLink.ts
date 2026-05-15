import { refreshAccessToken } from "../api_calls/fetchWithRefresh";

const REFRESH_FAILURE_MESSAGE =
  "Failed to refresh session. Please try logging in again.";
const POPUP_BLOCKED_MESSAGE =
  "Unable to open the session link automatically. Please allow pop-ups and try again.";

export async function openSessionLink(url: string): Promise<void> {
  const openedWindow = window.open("", "_blank");

  if (!openedWindow) {
    alert(POPUP_BLOCKED_MESSAGE);
    return;
  }

  try {
    const success = await refreshAccessToken();

    if (!success) {
      openedWindow.close();
      alert(REFRESH_FAILURE_MESSAGE);
      return;
    }

    openedWindow.location.replace(url);
  } catch (error) {
    openedWindow.close();
    console.error("Failed to open session link:", error);
    alert(REFRESH_FAILURE_MESSAGE);
  }
}

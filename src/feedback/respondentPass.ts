import { API_CONFIG } from "../config/api";
import { throwIfNotOk } from "../api_calls/apiErrors";
import { fetchWithRefresh } from "../api_calls/fetchWithRefresh";

/** RespondentPassResponse on the API: a ten-minute pass naming the signed-in person. */
export interface RespondentPass {
  token: string;
  expires_at: string;
}

/**
 * A pass naming the signed-in person for one feedback answer
 * (`POST /v2/users/me/respondent-pass`). The API signs it for Formbricks alone,
 * so it is useless as a bearer token anywhere else.
 */
export async function issueRespondentPass(): Promise<RespondentPass> {
  const response = await fetchWithRefresh(`${API_CONFIG.baseURL}/v2/users/me/respondent-pass`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: "{}",
  });
  await throwIfNotOk(response, "Issue respondent pass");
  const objects = ((await response.json()) as { objects?: RespondentPass[] } | null)?.objects;
  if (!Array.isArray(objects) || !objects[0]?.token) {
    throw new Error("The server answered without a respondent pass.");
  }
  return objects[0];
}

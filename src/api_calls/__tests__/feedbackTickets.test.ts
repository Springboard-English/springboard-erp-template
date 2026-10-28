import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { fetchWithRefreshMock } = vi.hoisted(() => ({ fetchWithRefreshMock: vi.fn() }));

vi.mock("../fetchWithRefresh", () => ({ fetchWithRefresh: fetchWithRefreshMock }));

import { API_CONFIG, configureApi } from "../../config/api";
import { dataUrlToBlob, submitReport } from "../../components/report/submitReport";

const fetchMock = vi.fn<typeof fetch>();

const TICKET_KEY = "7c9e6efe-9e1b-48e3-83e9-b7146883c1d0";
const PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgo=";

const submission = {
  reportType: "bug" as const,
  summary: "Save fails",
  description: "The form does not save.",
  category: "process" as const,
  priority: "medium" as const,
  contextLabel: "erp-hrm · /employees/3",
  evidence: [] as string[],
};

/** A JSON response wrapped the way every route answers. */
function envelope(object: unknown, status = 200): Response {
  return new Response(JSON.stringify({ attributes: { method: "POST", url: "" }, objects: [object] }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** The parsed JSON body of the nth fetchWithRefresh call. */
function bodyOf(call: number): unknown {
  const init = fetchWithRefreshMock.mock.calls[call]?.[1] as RequestInit;
  return JSON.parse(String(init.body));
}

const originalBase = API_CONFIG.baseURL;
beforeAll(() => configureApi({ baseUrl: "https://api.test" }));
afterAll(() => configureApi({ baseUrl: originalBase }));

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  fetchWithRefreshMock.mockReset();
});

describe("submitReport", () => {
  it("files the ticket in one POST to /v2/feedback-tickets", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(envelope({ appsheet_key: TICKET_KEY, summary: "Save fails" }, 201));

    await expect(submitReport(submission)).resolves.toEqual({ id: TICKET_KEY });

    expect(fetchWithRefreshMock).toHaveBeenCalledTimes(1);
    expect(fetchWithRefreshMock.mock.calls[0]?.[0]).toBe("https://api.test/v2/feedback-tickets");
    expect((fetchWithRefreshMock.mock.calls[0]?.[1] as RequestInit).method).toBe("POST");
    expect(bodyOf(0)).toEqual({
      summary: "Save fails",
      description: "The form does not save.\n\n[erp-hrm · /employees/3]",
      category: "process",
      priority: "medium",
      report_type: "bug",
      attachments: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uploads each screenshot to its signed URL with a plain PUT, then names the keys on the create", async () => {
    const upload = {
      upload_url: "https://storage.test/signed?sig=1",
      method: "PUT",
      headers: { "Content-Type": "image/png", "x-goog-content-length-range": "0,10485760" },
      key: "tmp/feedback-tickets/abc.png",
      expires_at: "2026-10-28T10:15:00Z",
    };
    fetchWithRefreshMock
      .mockResolvedValueOnce(envelope(upload))
      .mockResolvedValueOnce(envelope({ appsheet_key: TICKET_KEY, summary: "Save fails" }, 201));
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

    await submitReport({ ...submission, evidence: [PNG_DATA_URL] });

    expect(fetchWithRefreshMock.mock.calls[0]?.[0]).toBe("https://api.test/v2/feedback-tickets/upload-url");
    expect(bodyOf(0)).toEqual({ content_type: "image/png", size_bytes: dataUrlToBlob(PNG_DATA_URL).size });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [putUrl, putInit] = fetchMock.mock.calls[0] ?? [];
    expect(putUrl).toBe(upload.upload_url);
    expect(putInit?.method).toBe("PUT");
    expect(putInit?.headers).toEqual(upload.headers);
    expect(putInit?.body).toBeInstanceOf(Blob);

    expect(fetchWithRefreshMock.mock.calls[1]?.[0]).toBe("https://api.test/v2/feedback-tickets");
    expect(bodyOf(1)).toMatchObject({ attachments: [{ key: upload.key, filename: "screenshot-1.png" }] });
  });

  it("files nothing when an upload fails", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(
      envelope({ upload_url: "https://storage.test/x", method: "PUT", headers: {}, key: "tmp/feedback-tickets/x.png", expires_at: "" }),
    );
    fetchMock.mockResolvedValueOnce(new Response("denied", { status: 403 }));

    await expect(submitReport({ ...submission, evidence: [PNG_DATA_URL] })).rejects.toMatchObject({ status: 403 });
    expect(fetchWithRefreshMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces the API's refusal as an ApiError with its status", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "bad" }), { status: 400, headers: { "Content-Type": "application/json" } }),
    );

    await expect(submitReport(submission)).rejects.toMatchObject({ status: 400 });
  });
});

import { API_CONFIG } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";
import { throwIfNotOk } from "./apiErrors";

export type FeedbackTicketCategory = "lms" | "access_login" | "process" | "content_data" | "feature";
export type FeedbackTicketPriority = "low" | "medium" | "high";
export type FeedbackTicketReportType = "bug" | "feature" | "other";

/** A file uploaded through `upload-url`, named on a ticket to keep it. */
export interface FeedbackTicketAttachmentRef {
    key: string;
    filename: string;
}

/** The part of a filed ticket (`FeedbackTicketResponse`) the report dialog reads. */
export interface FeedbackTicket {
    appsheet_key: string;
    summary: string;
}

/** The body of `POST /v2/feedback-tickets` (`FeedbackTicketPostRequest`). */
export interface FeedbackTicketCreate {
    summary: string;
    description: string;
    category: FeedbackTicketCategory;
    priority: FeedbackTicketPriority;
    report_type?: FeedbackTicketReportType | null;
    suggested_owner_key?: string | null;
    attachments: FeedbackTicketAttachmentRef[];
}

/** Where to PUT one file (`MediaUploadTicketResponse`). */
export interface FeedbackTicketUploadTicket {
    upload_url: string;
    method: "PUT";
    headers: Record<string, string>;
    key: string;
    expires_at: string;
}

type Envelope<T> = { objects?: T[] };

const JSON_HEADERS = { Accept: "application/json", "Content-Type": "application/json" };

/** The URL of the feedback-tickets route, or of one of its sub-paths. */
function feedbackTicketsUrl(suffix = ""): string {
    return `${API_CONFIG.baseURL}/v2/feedback-tickets${suffix}`;
}

/** The single object an `ApiEnvelope` carries; throws an `ApiError` on a non-2xx. */
async function readOne<T>(response: Response, context: string): Promise<T> {
    await throwIfNotOk(response, context);
    const payload = (await response.json()) as Envelope<T>;
    const object = payload.objects?.[0];
    if (!object) throw new Error(`${context}: the response carried no object.`);
    return object;
}

/** Files a ticket; the reporter is the caller. */
export async function createFeedbackTicket(body: FeedbackTicketCreate): Promise<FeedbackTicket> {
    const response = await fetchWithRefresh(feedbackTicketsUrl(), {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
    });
    return readOne<FeedbackTicket>(response, "Failed to send the report");
}

/** Asks for a signed URL to upload one file of this type and size. */
export async function requestFeedbackTicketUpload(
    contentType: string,
    sizeBytes: number,
): Promise<FeedbackTicketUploadTicket> {
    const response = await fetchWithRefresh(feedbackTicketsUrl("/upload-url"), {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ content_type: contentType, size_bytes: sizeBytes }),
    });
    return readOne<FeedbackTicketUploadTicket>(response, "Failed to prepare the upload");
}

/** Uploads `file` to storage and returns the reference a ticket keeps. */
export async function uploadFeedbackTicketFile(
    file: Blob,
    filename: string,
): Promise<FeedbackTicketAttachmentRef> {
    const ticket = await requestFeedbackTicketUpload(file.type, file.size);
    // A plain fetch: the signed URL is the credential, and a bearer header would break it.
    const response = await fetch(ticket.upload_url, {
        method: ticket.method ?? "PUT",
        headers: ticket.headers,
        body: file,
    });
    await throwIfNotOk(response, "Failed to upload the file");
    return { key: ticket.key, filename };
}

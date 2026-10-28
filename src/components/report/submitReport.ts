import {
  createFeedbackTicket,
  uploadFeedbackTicketFile,
  type FeedbackTicketAttachmentRef,
  type FeedbackTicketCategory,
  type FeedbackTicketPriority,
  type FeedbackTicketReportType,
} from "../../api_calls/feedbackTickets";

export interface ReportSubmission {
  reportType: FeedbackTicketReportType;
  summary: string;
  description: string;
  category: FeedbackTicketCategory;
  priority: FeedbackTicketPriority;
  /** Where it was reported from ("lms · /classes/3a"); appended to the description. */
  contextLabel: string;
  /** Screenshots and attached images, as data URLs. */
  evidence: string[];
}

/** What a filed report hands back. */
export interface SubmittedReport {
  id: string;
}

/** Decodes a `data:` URL into a Blob carrying its MIME type. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(",");
  const meta = dataUrl.slice(0, Math.max(0, comma));
  const mimeType = /^data:([^;,]+)/.exec(meta)?.[1] ?? "image/png";
  const binary = atob(dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

/** Uploads each piece of evidence and returns the references to file with the ticket. */
async function uploadEvidence(evidence: string[]): Promise<FeedbackTicketAttachmentRef[]> {
  const refs: FeedbackTicketAttachmentRef[] = [];
  // Sequential: a failure stops before the next upload, and nothing is filed.
  for (const [index, dataUrl] of evidence.entries()) {
    const blob = dataUrlToBlob(dataUrl);
    const extension = blob.type === "image/jpeg" ? "jpg" : "png";
    refs.push(await uploadFeedbackTicketFile(blob, `screenshot-${index + 1}.${extension}`));
  }
  return refs;
}

/** Uploads the evidence, then files the ticket in one request. Returns the new ticket's key. */
export async function submitReport(submission: ReportSubmission): Promise<SubmittedReport> {
  const attachments = await uploadEvidence(submission.evidence);
  const ticket = await createFeedbackTicket({
    summary: submission.summary,
    description: `${submission.description}\n\n[${submission.contextLabel}]`,
    category: submission.category,
    priority: submission.priority,
    report_type: submission.reportType,
    attachments,
  });
  return { id: ticket.appsheet_key };
}

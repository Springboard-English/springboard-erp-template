import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAssessmentSectionRequest } from "@/api_calls/UserData";
import FormTableDialog, {
    FormTableRow,
} from "@/components/management/FormTableDialog";

interface CreateAssessmentSectionDialogProps {
    open: boolean;
    saving?: boolean;
    error?: string | null;
    sectionOptions: string[];
    onClose: () => void;
    onSubmit: (values: CreateAssessmentSectionRequest) => Promise<void> | void;
}

export default function CreateAssessmentSectionDialog({
    open,
    saving = false,
    error,
    sectionOptions,
    onClose,
    onSubmit,
}: CreateAssessmentSectionDialogProps) {
    const [section, setSection] = useState("");
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        setSection("");
        setScore("");
        setFeedback("");
    }, [open]);

    const parsedScore = Number(score);

    return (
        <FormTableDialog
            open={open}
            saving={saving}
            title="Create Assessment Section"
            error={error}
            submitLabel="Create"
            submitDisabled={
                !section.trim() ||
                !Number.isFinite(parsedScore) ||
                parsedScore < 0
            }
            onClose={onClose}
            onSubmit={() =>
                onSubmit({
                    section: section.trim(),
                    score: parsedScore,
                    feedback: feedback.trim() || null,
                })
            }
        >
            <FormTableRow label="Section" required>
                <SearchableSelect
                    id="assessment-section-name"
                    value={section}
                    onValueChange={setSection}
                    disabled={saving || sectionOptions.length === 0}
                    options={[
                        {
                            value: "",
                            label:
                                sectionOptions.length > 0
                                    ? "-- Section --"
                                    : "No sections available",
                        },
                        ...sectionOptions.map((option) => ({
                            value: option,
                            label: option,
                        })),
                    ]}
                    placeholder={
                        sectionOptions.length > 0
                            ? "-- Section --"
                            : "No sections available"
                    }
                    searchPlaceholder="Search sections..."
                />
            </FormTableRow>

            <FormTableRow label="Score" required>
                <Input
                    id="assessment-section-score"
                    type="number"
                    min="0"
                    step="any"
                    value={score}
                    onChange={(event) => setScore(event.target.value)}
                    placeholder="0"
                    disabled={saving}
                />
            </FormTableRow>

            <FormTableRow label="Feedback">
                <Textarea
                    id="assessment-section-feedback"
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    rows={4}
                    disabled={saving}
                    className="resize-y"
                />
            </FormTableRow>
        </FormTableDialog>
    );
}

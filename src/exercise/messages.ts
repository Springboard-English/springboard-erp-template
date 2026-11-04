/**
 * Vietnamese for the exercise code. English stays inline at each `t()` call as
 * the fallback. An app that imports `/exercise` merges this into its `vi`
 * messages, as it merges its own catalog; the root entry's catalog is untouched.
 * Keys under `exercise.value.` translate fixed English values through `valueLabel`.
 */
export const EXERCISE_VIETNAMESE_MESSAGES: Record<string, string> = {
  "exercise.collection.plainRun": "Chuỗi câu hỏi thông thường",
  "exercise.collection.taskWordOne": "{task} · 1 từ",
  "exercise.collection.taskWordOther": "{task} · {n} từ",
  "exercise.collection.layoutMismatchOne":
    "Mục {task} chỉ hiển thị đúng khi mọi câu hỏi đều là {type} — 1 câu ở đây không phải, nên học viên sẽ thấy các thẻ câu hỏi thông thường.",
  "exercise.collection.layoutMismatchOther":
    "Mục {task} chỉ hiển thị đúng khi mọi câu hỏi đều là {type} — {n} câu ở đây không phải, nên học viên sẽ thấy các thẻ câu hỏi thông thường.",
  "exercise.media.chooseAudio": "Chọn một file âm thanh (MP3, M4A, WAV, OGG hoặc WebM).",
  "exercise.media.empty": "File này trống.",
  "exercise.media.stopped": "Đã dừng · {at} / {length}",
  "exercise.media.tooLarge": "File có dung lượng {size}; giới hạn là {limit}.",
  "exercise.question.untitled": "Câu hỏi chưa có tiêu đề",
  "exercise.recording.question": "Câu {n}",
  "exercise.recording.untitled": "Bài nghe",
  "exercise.recording.wholeTest": "Toàn bộ đề",
  "exercise.structure.part": "Phần",
  "exercise.structure.section": "Mục",

  // Skills (`SKILL_LABELS`).
  "exercise.value.Reading": "Đọc",
  "exercise.value.Listening": "Nghe",
  "exercise.value.Vocabulary & Grammar": "Từ vựng & Ngữ pháp",
  "exercise.value.Writing": "Viết",
  "exercise.value.Speaking": "Nói",
  // Question types (`QUESTION_TYPE_LABELS`).
  "exercise.value.Multiple choice": "Trắc nghiệm",
  "exercise.value.Gap filling": "Điền vào chỗ trống",
  "exercise.value.Short answer": "Trả lời ngắn",
  "exercise.value.Sentence rewriting": "Viết lại câu",
  "exercise.value.Error identification & correction": "Tìm và sửa lỗi",
  "exercise.value.Reading passage + question": "Đoạn văn + câu hỏi",
  "exercise.value.True / False / Not Given": "True / False / Not Given",
  "exercise.value.Essay": "Bài luận",
  // Section tasks (`sectionTaskLabel`).
  "exercise.value.Open cloze / summary completion": "Điền từ tự do / hoàn thành tóm tắt",
  "exercise.value.Cloze from a word bank": "Điền từ từ ngân hàng từ",
  "exercise.value.Guided cloze": "Điền từ có gợi ý",
  "exercise.value.Word formation": "Cấu tạo từ",
  "exercise.value.Gapped text": "Điền câu vào đoạn văn",
  "exercise.value.Jumbled paragraphs": "Sắp xếp đoạn văn",
  "exercise.value.Choose several": "Chọn nhiều đáp án",
  "exercise.value.Multiple matching": "Nối thông tin",
  "exercise.value.Error correction in a passage": "Sửa lỗi trong đoạn văn",
};

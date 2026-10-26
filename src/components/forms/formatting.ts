// Number formats for forms: Vietnamese digit grouping (1.200.000) and an
// amount written out in words, as contracts and acceptance records print them.

/** `1200000` → `1.200.000`; rounds to whole units; empty for null. */
export function formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return "";
    }
    const rounded = Math.round(value);
    const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return rounded < 0 ? `-${digits}` : digits;
}

/** `1.200.000`, `1 200 000` or `1200000` → `1200000`; null when there are no digits. */
export function parseMoney(text: string): number | null {
    const digits = text.replace(/[^\d-]/g, "");
    if (!/\d/.test(digits)) {
        return null;
    }
    const value = Number(digits);
    return Number.isFinite(value) ? value : null;
}

/** A typed number, accepting a comma as the decimal point; null when blank or not a number. */
export function parseNumber(text: string): number | null {
    const trimmed = text.trim().replace(",", ".");
    if (!trimmed) {
        return null;
    }
    const value = Number(trimmed);
    return Number.isFinite(value) ? value : null;
}

const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const SCALES = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

/** One group of three digits, with "linh", "mốt" and "lăm" where Vietnamese reads them. */
function groupWords(group: number, leading: boolean): string[] {
    const hundreds = Math.floor(group / 100);
    const tens = Math.floor((group % 100) / 10);
    const units = group % 10;
    const words: string[] = [];
    if (!leading || hundreds > 0) {
        words.push(DIGITS[hundreds], "trăm");
    }
    if (tens === 0) {
        if (units > 0 && words.length > 0) words.push("linh");
    } else if (tens === 1) {
        words.push("mười");
    } else {
        words.push(DIGITS[tens], "mươi");
    }
    if (units === 1 && tens > 1) words.push("mốt");
    else if (units === 5 && tens > 0) words.push("lăm");
    else if (units > 0) words.push(DIGITS[units]);
    return words;
}

/**
 * A whole amount in Vietnamese words, capitalised, with `unit` after it:
 * `2100000` → `Hai triệu một trăm nghìn đồng`. Fractions are rounded away.
 */
export function vietnameseAmountWords(value: number, unit = "đồng"): string {
    let rest = Math.round(Math.abs(value));
    const words: string[] = [];
    if (rest === 0) {
        words.push("không");
    } else {
        const groups: number[] = [];
        while (rest > 0) {
            groups.push(rest % 1000);
            rest = Math.floor(rest / 1000);
        }
        for (let index = groups.length - 1; index >= 0; index -= 1) {
            if (groups[index] === 0) continue;
            words.push(...groupWords(groups[index], index === groups.length - 1));
            if (SCALES[index]) words.push(SCALES[index]);
        }
    }
    if (value < 0) words.unshift("âm");
    if (unit) words.push(unit);
    const text = words.join(" ");
    return text.charAt(0).toUpperCase() + text.slice(1);
}

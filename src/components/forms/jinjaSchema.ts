import type { FormField, FormSchema } from "./schema";

// A form read off a Jinja template's own source, for a template no one has
// described yet: every name the page reads becomes a field, typed by how the
// page reads it.

const TAG = /\{\{-?([\s\S]*?)-?\}\}|\{%-?([\s\S]*?)-?%\}/g;
const TOKEN = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_]\w*|\d+(?:\.\d+)?|==|!=|\S/g;
const IDENTIFIER = /^[A-Za-z_]\w*$/;
const NOT_A_VARIABLE = new Set([
    "if", "else", "elif", "and", "or", "not", "in", "is", "for", "set", "as", "with",
    "recursive", "true", "false", "none", "True", "False", "None", "loop",
]);

interface Usage {
    list: boolean;
    output: boolean;
    fallbackOnly: boolean;
    condition: boolean;
    options: string[];
}

function isLiteral(token: string | undefined): token is string {
    return token !== undefined && (token.startsWith('"') || token.startsWith("'"));
}

/**
 * The fields a Jinja page reads, in first-seen order: a `{% for %}` iterable is
 * a list (its columns are the loop variable's attributes), a name compared to a
 * string is a choice, a name only tested is a checkbox, and a printed name is
 * text, optional when printed `or` a default. Called functions (`signature`)
 * and `set` locals are not fields.
 */
export function inferJinjaSchema(source: string): FormSchema {
    const usage = new Map<string, Usage>();
    const loopOf = new Map<string, string>();
    const locals = new Set<string>();

    const use = (name: string): Usage => {
        let entry = usage.get(name);
        if (!entry) {
            entry = { list: false, output: false, fallbackOnly: true, condition: false, options: [] };
            usage.set(name, entry);
        }
        return entry;
    };

    for (const match of source.matchAll(TAG)) {
        const isStatement = match[2] !== undefined;
        const tokens: string[] = (match[1] ?? match[2]).match(TOKEN) ?? [];
        let start = 0;
        let inCondition = false;
        if (isStatement) {
            const head = tokens[0];
            if (head === "for") {
                const inAt = tokens.indexOf("in");
                tokens.slice(1, inAt).filter((token) => IDENTIFIER.test(token)).forEach((token) => locals.add(token));
                const iterable = tokens[inAt + 1];
                if (iterable && IDENTIFIER.test(iterable) && !locals.has(iterable)) {
                    use(iterable).list = true;
                    loopOf.set(tokens[1], iterable);
                }
                continue;
            }
            if (head === "set") {
                locals.add(tokens[1]);
                start = 3;
            } else if (head === "if" || head === "elif") {
                inCondition = true;
                start = 1;
            } else {
                continue;
            }
        }
        for (let index = start; index < tokens.length; index += 1) {
            const token = tokens[index];
            if (token === "if") inCondition = true;
            else if (token === "else") inCondition = false;
            const previous = tokens[index - 1];
            const next = tokens[index + 1];
            if (
                !IDENTIFIER.test(token) ||
                NOT_A_VARIABLE.has(token) ||
                locals.has(token) ||
                previous === "." ||
                previous === "|" ||
                previous === "is" ||
                next === "("
            ) {
                continue;
            }
            const entry = use(token);
            const compared = tokens[index + 2];
            if ((next === "==" || next === "!=") && isLiteral(compared)) {
                const option = compared.slice(1, -1);
                if (!entry.options.includes(option)) entry.options.push(option);
            } else if (inCondition) {
                entry.condition = true;
            } else {
                entry.output = true;
                if (next !== "or") entry.fallbackOnly = false;
            }
        }
    }

    const fields: FormField[] = [];
    for (const [name, entry] of usage) {
        if (entry.list) {
            const columns: string[] = [];
            for (const [loopVar, iterable] of loopOf) {
                if (iterable !== name) continue;
                for (const column of source.matchAll(new RegExp(`\\b${loopVar}\\.([A-Za-z_]\\w*)`, "g"))) {
                    if (!columns.includes(column[1])) columns.push(column[1]);
                }
            }
            fields.push({
                name,
                label: name,
                type: "list",
                span: "full",
                required: true,
                columns: columns.map((column) => ({ name: column, label: column, type: "text", required: true })),
            });
        } else if (entry.options.length > 0) {
            fields.push({
                name,
                label: name,
                type: "choice",
                required: true,
                options: entry.options.map((value) => ({ value })),
            });
        } else if (entry.output) {
            fields.push({ name, label: name, type: "text", required: !entry.fallbackOnly });
        } else {
            fields.push({ name, label: name, type: "checkbox" });
        }
    }
    return { sections: [{ id: "details" }], fields };
}

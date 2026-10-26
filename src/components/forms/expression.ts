import { vietnameseAmountWords } from "./formatting";

// The formula and `showIf` language: arithmetic, comparisons, and/or/not,
// `if(c, a, b)`, `sum(list.column)`, `round`, `min`, `max` and `words`.
// Parsed into a tree and evaluated here, never with `eval`, because a stored
// schema is untrusted text.

export type ExprValue = number | string | boolean | null | ExprValue[];

/** Resolves a dotted name; `list.column` returns that column of every row. */
export type ExprScope = (path: string[]) => ExprValue;

type Node =
    | { kind: "literal"; value: ExprValue }
    | { kind: "name"; path: string[] }
    | { kind: "unary"; op: "-" | "not"; arg: Node }
    | { kind: "binary"; op: string; left: Node; right: Node }
    | { kind: "call"; fn: string; args: Node[] };

export class ExpressionError extends Error {}

const TOKEN = /\s*(?:(\d+(?:\.\d+)?)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)|(==|!=|<=|>=|[-+*/%<>(),]))/y;
const KEYWORDS = new Set(["and", "or", "not", "true", "false", "null"]);
const FUNCTIONS = new Set(["if", "sum", "round", "min", "max", "words"]);

interface Token {
    kind: "number" | "string" | "name" | "op";
    text: string;
}

/** Splits an expression into tokens, refusing anything outside the language. */
function tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    TOKEN.lastIndex = 0;
    let index = 0;
    while (index < source.length) {
        if (/^\s*$/.test(source.slice(index))) {
            break;
        }
        TOKEN.lastIndex = index;
        const match = TOKEN.exec(source);
        if (!match) {
            throw new ExpressionError(`Unexpected "${source.slice(index).trim().slice(0, 12)}"`);
        }
        index = TOKEN.lastIndex;
        if (match[1] !== undefined) tokens.push({ kind: "number", text: match[1] });
        else if (match[2] !== undefined) tokens.push({ kind: "string", text: match[2] });
        else if (match[3] !== undefined) tokens.push({ kind: "name", text: match[3] });
        else tokens.push({ kind: "op", text: match[4] });
    }
    return tokens;
}

/** Recursive descent over the tokens: or < and < not < comparison < sum < product < unary. */
function parse(source: string): Node {
    const tokens = tokenize(source);
    let position = 0;
    const peek = () => tokens[position];
    const take = () => tokens[position++];
    const isWord = (word: string) => peek()?.kind === "name" && peek()?.text === word;
    const expectOp = (op: string) => {
        if (peek()?.kind !== "op" || peek()?.text !== op) {
            throw new ExpressionError(`Expected "${op}"`);
        }
        position += 1;
    };

    const primary = (): Node => {
        const token = take();
        if (!token) throw new ExpressionError("The expression ends too soon");
        if (token.kind === "number") return { kind: "literal", value: Number(token.text) };
        if (token.kind === "string") {
            return { kind: "literal", value: token.text.slice(1, -1).replace(/\\(.)/g, "$1") };
        }
        if (token.kind === "op" && token.text === "(") {
            const inner = or();
            expectOp(")");
            return inner;
        }
        if (token.kind === "name") {
            if (token.text === "true" || token.text === "false") return { kind: "literal", value: token.text === "true" };
            if (token.text === "null") return { kind: "literal", value: null };
            if (peek()?.kind === "op" && peek()?.text === "(") {
                if (!FUNCTIONS.has(token.text)) throw new ExpressionError(`Unknown function ${token.text}()`);
                position += 1;
                const args: Node[] = [];
                if (!(peek()?.kind === "op" && peek()?.text === ")")) {
                    args.push(or());
                    while (peek()?.kind === "op" && peek()?.text === ",") {
                        position += 1;
                        args.push(or());
                    }
                }
                expectOp(")");
                return { kind: "call", fn: token.text, args };
            }
            if (KEYWORDS.has(token.text)) throw new ExpressionError(`Unexpected "${token.text}"`);
            return { kind: "name", path: token.text.split(".") };
        }
        throw new ExpressionError(`Unexpected "${token.text}"`);
    };
    const unary = (): Node => {
        if (peek()?.kind === "op" && peek()?.text === "-") {
            position += 1;
            return { kind: "unary", op: "-", arg: unary() };
        }
        return primary();
    };
    const binaryLevel = (next: () => Node, ops: string[]) => (): Node => {
        let left = next();
        while (peek()?.kind === "op" && ops.includes(peek()!.text)) {
            const op = take().text;
            left = { kind: "binary", op, left, right: next() };
        }
        return left;
    };
    const product = binaryLevel(unary, ["*", "/", "%"]);
    const sum = binaryLevel(product, ["+", "-"]);
    const comparison = binaryLevel(sum, ["==", "!=", "<", "<=", ">", ">="]);
    const not = (): Node => {
        if (isWord("not")) {
            position += 1;
            return { kind: "unary", op: "not", arg: not() };
        }
        return comparison();
    };
    const and = (): Node => {
        let left = not();
        while (isWord("and")) {
            position += 1;
            left = { kind: "binary", op: "and", left, right: not() };
        }
        return left;
    };
    const or = (): Node => {
        let left = and();
        while (isWord("or")) {
            position += 1;
            left = { kind: "binary", op: "or", left, right: and() };
        }
        return left;
    };

    const tree = or();
    if (position < tokens.length) {
        throw new ExpressionError(`Unexpected "${tokens[position].text}"`);
    }
    return tree;
}

const cache = new Map<string, Node>();

/** The parsed tree for `source`, kept so a form re-rendering per keystroke parses once. */
function compiled(source: string): Node {
    let tree = cache.get(source);
    if (!tree) {
        tree = parse(source);
        cache.set(source, tree);
    }
    return tree;
}

/** A number from a value: empty and non-numeric count as 0, as a blank cell does in a sheet. */
function num(value: ExprValue): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string") {
        const parsed = Number(value.replace(/[.\s]/g, "").replace(",", "."));
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}

function truthy(value: ExprValue): boolean {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== false && value !== 0 && value !== "";
}

function flatNumbers(values: ExprValue[]): number[] {
    return values.flatMap((value) => (Array.isArray(value) ? flatNumbers(value) : [num(value)]));
}

/** Evaluates a parsed tree against a scope. */
function evaluateNode(node: Node, scope: ExprScope): ExprValue {
    switch (node.kind) {
        case "literal":
            return node.value;
        case "name":
            return scope(node.path);
        case "unary":
            return node.op === "-" ? -num(evaluateNode(node.arg, scope)) : !truthy(evaluateNode(node.arg, scope));
        case "binary": {
            if (node.op === "and") {
                const left = evaluateNode(node.left, scope);
                return truthy(left) ? evaluateNode(node.right, scope) : left;
            }
            if (node.op === "or") {
                const left = evaluateNode(node.left, scope);
                return truthy(left) ? left : evaluateNode(node.right, scope);
            }
            const left = evaluateNode(node.left, scope);
            const right = evaluateNode(node.right, scope);
            switch (node.op) {
                case "+":
                    return typeof left === "string" && typeof right === "string" ? left + right : num(left) + num(right);
                case "-":
                    return num(left) - num(right);
                case "*":
                    return num(left) * num(right);
                case "/":
                    return num(right) === 0 ? null : num(left) / num(right);
                case "%":
                    return num(right) === 0 ? null : num(left) % num(right);
                case "==":
                    return typeof left === "number" || typeof right === "number" ? num(left) === num(right) : left === right;
                case "!=":
                    return typeof left === "number" || typeof right === "number" ? num(left) !== num(right) : left !== right;
                case "<":
                    return num(left) < num(right);
                case "<=":
                    return num(left) <= num(right);
                case ">":
                    return num(left) > num(right);
                default:
                    return num(left) >= num(right);
            }
        }
        case "call": {
            const args = node.args;
            switch (node.fn) {
                case "if":
                    if (args.length !== 3) throw new ExpressionError("if() takes a condition and two values");
                    return truthy(evaluateNode(args[0], scope)) ? evaluateNode(args[1], scope) : evaluateNode(args[2], scope);
                case "sum":
                    return flatNumbers(args.map((arg) => evaluateNode(arg, scope))).reduce((total, value) => total + value, 0);
                case "min":
                case "max": {
                    const values = flatNumbers(args.map((arg) => evaluateNode(arg, scope)));
                    if (values.length === 0) return null;
                    return node.fn === "min" ? Math.min(...values) : Math.max(...values);
                }
                case "round": {
                    const value = num(evaluateNode(args[0], scope));
                    const digits = args[1] ? num(evaluateNode(args[1], scope)) : 0;
                    const factor = 10 ** digits;
                    return Math.round(value * factor) / factor;
                }
                default: {
                    const unit = args[1] ? evaluateNode(args[1], scope) : "đồng";
                    return vietnameseAmountWords(num(evaluateNode(args[0], scope)), typeof unit === "string" ? unit : "");
                }
            }
        }
    }
}

/** Evaluates `source` in `scope`; throws `ExpressionError` when it does not parse. */
export function evaluateExpression(source: string, scope: ExprScope): ExprValue {
    return evaluateNode(compiled(source), scope);
}

/** The error message for `source`, or null when it parses; for a builder's field editor. */
export function checkExpression(source: string): string | null {
    try {
        compiled(source);
        return null;
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
}

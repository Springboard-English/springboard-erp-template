import { describe, expect, it } from "vitest";
import { checkExpression, evaluateExpression, type ExprValue } from "../expression";
import { formatMoney, parseMoney, vietnameseAmountWords } from "../formatting";

const scope = (values: Record<string, ExprValue>) => (path: string[]) => values[path.join(".")] ?? null;

describe("evaluateExpression", () => {
    it("does arithmetic with precedence and treats blanks as zero", () => {
        expect(evaluateExpression("sessions * unit_price + 1", scope({ sessions: 8, unit_price: 150000 }))).toBe(1200001);
        expect(evaluateExpression("(1 + 2) * 3", scope({}))).toBe(9);
        expect(evaluateExpression("missing * 2", scope({}))).toBe(0);
        expect(evaluateExpression("-x + 1", scope({ x: 3 }))).toBe(-2);
    });

    it("compares, branches and short-circuits", () => {
        const values = scope({ total: 6000000, conclusion: "pass" });
        expect(evaluateExpression("if(total >= 5000000, round(total * 0.1), 0)", values)).toBe(600000);
        expect(evaluateExpression("conclusion != 'pass' and total > 0", values)).toBe(false);
        expect(evaluateExpression("not conclusion == 'fail'", values)).toBe(true);
    });

    it("sums a list column and writes words", () => {
        expect(evaluateExpression("sum(items.amount)", scope({ "items.amount": [1200000, 900000] }))).toBe(2100000);
        expect(evaluateExpression("words(2100000)", scope({}))).toBe("Hai triệu một trăm nghìn đồng");
        expect(evaluateExpression("max(1, 5, 3)", scope({}))).toBe(5);
    });

    it("refuses anything outside the language", () => {
        expect(checkExpression("constructor.constructor('x')()")).toMatch(/Unknown function|Unexpected/);
        expect(checkExpression("a ;b")).toMatch(/Unexpected/);
        expect(checkExpression("if(a, b")).toMatch(/Expected/);
        expect(checkExpression("sessions * unit_price")).toBeNull();
    });
});

describe("formatting", () => {
    it("groups money with dots and reads it back", () => {
        expect(formatMoney(1200000)).toBe("1.200.000");
        expect(formatMoney(-50000)).toBe("-50.000");
        expect(formatMoney(null)).toBe("");
        expect(parseMoney("1.200.000 đ")).toBe(1200000);
        expect(parseMoney("")).toBeNull();
    });

    it("reads Vietnamese amounts the way they are written on paper", () => {
        expect(vietnameseAmountWords(0)).toBe("Không đồng");
        expect(vietnameseAmountWords(15)).toBe("Mười lăm đồng");
        expect(vietnameseAmountWords(21)).toBe("Hai mươi mốt đồng");
        expect(vietnameseAmountWords(105)).toBe("Một trăm linh năm đồng");
        expect(vietnameseAmountWords(1000005)).toBe("Một triệu không trăm linh năm đồng");
        expect(vietnameseAmountWords(5400000)).toBe("Năm triệu bốn trăm nghìn đồng");
        expect(vietnameseAmountWords(1250000000, "")).toBe("Một tỷ hai trăm năm mươi triệu");
    });
});

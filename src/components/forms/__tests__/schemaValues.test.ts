import { describe, expect, it } from "vitest";
import { inferJinjaSchema } from "../jinjaSchema";
import { parseFormSchema, type FormSchema } from "../schema";
import { initialFormValues, missingFormFields, outputFormValues } from "../schemaValues";

// The BBNT acceptance record's form, cut down: a lookup, a list with a row
// formula and a total, and formulas over the total.
const BBNT: FormSchema = {
    sections: [{ id: "who" }, { id: "work" }, { id: "pay" }],
    fields: [
        { name: "collaborator", label: "Cộng tác viên", type: "lookup", source: "employee", section: "who", required: true, send: false },
        { name: "collaborator_name", label: "Họ và tên", type: "text", section: "who", required: true },
        {
            name: "work_items",
            label: "Lớp",
            type: "list",
            section: "work",
            required: true,
            columns: [
                { name: "class_name", label: "Lớp/Nhóm", type: "text", required: true },
                { name: "sessions", label: "Số buổi", type: "number", required: true },
                { name: "unit_price", label: "Đơn giá", type: "money", required: true },
                { name: "amount", label: "Thành tiền", type: "formula", expr: "sessions * unit_price", format: "money" },
            ],
            totals: [{ column: "amount", into: "total_amount" }],
        },
        { name: "net_amount", label: "Thực nhận", type: "formula", section: "pay", format: "money", expr: "total_amount - tax" },
        { name: "tax", label: "Thuế", type: "formula", section: "pay", format: "money", expr: "if(total_amount >= 5000000, round(total_amount * 0.1), 0)" },
        { name: "net_amount_words", label: "Bằng chữ", type: "formula", section: "pay", expr: "words(net_amount)" },
        { name: "remarks", label: "Nhận xét", type: "text", section: "pay", showIf: "net_amount > 0" },
    ],
};

const filled = {
    ...initialFormValues(BBNT),
    collaborator: "8f1c",
    collaborator_name: " Nguyễn Thị Hoa ",
    work_items: [
        { class_name: "IELTS 5.0 – K12", sessions: 8, unit_price: 150000, amount: null },
        { class_name: "TOEIC 450 – K3", sessions: 30, unit_price: 150000, amount: null },
    ],
};

describe("schema values", () => {
    it("starts a required list with one empty row and lists what is missing", () => {
        const values = initialFormValues(BBNT);
        expect(values.work_items).toEqual([{ class_name: "", sessions: null, unit_price: null, amount: null }]);
        expect(missingFormFields(BBNT, values).map((item) => item.label)).toEqual([
            "Cộng tác viên",
            "Họ và tên",
            "Lớp (1: Lớp/Nhóm)",
            "Lớp (1: Số buổi)",
            "Lớp (1: Đơn giá)",
        ]);
        expect(missingFormFields(BBNT, filled)).toEqual([]);
    });

    it("prints row formulas, totals and formulas that read later formulas", () => {
        expect(outputFormValues(BBNT, filled, "print")).toEqual({
            collaborator_name: "Nguyễn Thị Hoa",
            work_items: [
                { class_name: "IELTS 5.0 – K12", sessions: "8", unit_price: "150.000", amount: "1.200.000" },
                { class_name: "TOEIC 450 – K3", sessions: "30", unit_price: "150.000", amount: "4.500.000" },
            ],
            total_amount: "5.700.000",
            net_amount: "5.130.000",
            tax: "570.000",
            net_amount_words: "Năm triệu một trăm ba mươi nghìn đồng",
            remarks: "",
        });
    });

    it("keeps numbers typed for an API body", () => {
        const typed = outputFormValues(BBNT, filled);
        expect(typed.total_amount).toBe(5700000);
        expect(typed.net_amount).toBe(5130000);
        expect(typed).not.toHaveProperty("collaborator");
    });
});

describe("parseFormSchema", () => {
    it("keeps what it understands from stored JSON and drops the rest", () => {
        const schema = parseFormSchema({
            sections: [{ id: "a", columns: 9 }],
            fields: [
                { name: "ok", type: "choice", options: ["pass", { value: "fail", label: "Không đạt" }], junk: 1 },
                { name: "bad name", type: "text" },
                { name: "nope", type: "spreadsheet" },
                { name: "rows", type: "list", columns: [{ name: "inner", type: "list" }, { name: "c", type: "money" }] },
            ],
        });
        expect(schema?.sections).toEqual([{ id: "a" }]);
        expect(schema?.fields).toEqual([
            { name: "ok", label: "ok", type: "choice", options: [{ value: "pass" }, { value: "fail", label: "Không đạt" }] },
            { name: "rows", label: "rows", type: "list", columns: [{ name: "c", label: "c", type: "money" }] },
        ]);
        expect(parseFormSchema({ fields: "x" })).toBeNull();
    });
});

describe("inferJinjaSchema", () => {
    it("types each name by how the template reads it", () => {
        const schema = inferJinjaSchema(`
            {% for item in work_items %}{{ loop.index }} {{ item.class_name }} {{ item.amount }}{% endfor %}
            {{ "☒" if quality_met else "☐" }} {{ "☒" if conclusion == "pass" else "☐" }}
            {{ remarks or "Không." }} {{ signature("company") }} {{ collaborator_name | upper }}
            {% set local = 1 %}{{ local }}
        `);
        expect(schema.fields.map((field) => [field.name, field.type, field.required ?? false])).toEqual([
            ["work_items", "list", true],
            ["quality_met", "checkbox", false],
            ["conclusion", "choice", true],
            ["remarks", "text", false],
            ["collaborator_name", "text", true],
        ]);
        expect(schema.fields[0].columns?.map((column) => column.name)).toEqual(["class_name", "amount"]);
    });
});

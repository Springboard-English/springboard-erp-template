import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/context/I18nContext";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { TagFilter, type TagFilterOption } from "@/components/ui/tag-filter";

// Radix's popover asks for pointer-capture APIs jsdom does not implement.
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => undefined;
  Element.prototype.releasePointerCapture ??= () => undefined;
  Element.prototype.scrollIntoView ??= () => undefined;
});

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

/** A SearchableSelect that owns its value, like a real form field. */
function Fruit({ initial, onChange }: { initial: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <I18nProvider>
      <SearchableSelect
        value={value}
        options={FRUITS}
        onValueChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
      />
    </I18nProvider>
  );
}

/** A TagFilter that owns its value; `loaded` stands in for a finished tags query. */
function Tags({
  initial,
  options,
  loaded,
}: {
  initial: string[];
  options: TagFilterOption[];
  loaded: boolean;
}) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <I18nProvider>
      <TagFilter value={value} onValueChange={setValue} options={options} optionsLoaded={loaded} />
      <output data-testid="value">{value.join(",")}</output>
    </I18nProvider>
  );
}

describe("SearchableSelect", () => {
  it("lists the current choice first and highlights it", async () => {
    const user = userEvent.setup();
    render(<Fruit initial="cherry" />);

    const field = screen.getByRole("combobox");
    expect(field).toHaveValue("Cherry");
    await user.click(field);

    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(["Cherry", "Apple", "Banana"]);
    expect(field).toHaveAttribute("aria-activedescendant", options[0]?.id);
  });

  it("searches in the field itself, replacing the label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Fruit initial="cherry" onChange={onChange} />);

    const field = screen.getByRole("combobox");
    await user.click(field);
    await user.keyboard("ban");

    expect(field).toHaveValue("ban");
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Banana"]);

    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("banana");
    await waitFor(() => expect(field).toHaveValue("Banana"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("restores the label when closed without picking", async () => {
    const user = userEvent.setup();
    render(<Fruit initial="apple" />);

    const field = screen.getByRole("combobox");
    await user.click(field);
    await user.keyboard("zzz{Escape}");

    expect(field).toHaveValue("Apple");
  });
});

describe("TagFilter", () => {
  it("keeps a tag that went away listed and untickable", async () => {
    const user = userEvent.setup();
    render(<Tags initial={["gone", "reading"]} options={[{ tag: "reading", count: 2 }]} loaded={false} />);

    await user.click(screen.getByRole("combobox"));
    const stale = screen.getByRole("option", { name: /gone/ });
    expect(stale).toHaveTextContent("Not in use");

    await user.click(stale);
    expect(screen.getByTestId("value")).toHaveTextContent(/^reading$/);
  });

  it("drops a selected tag the loaded list no longer has", async () => {
    render(<Tags initial={["gone", "reading"]} options={[{ tag: "reading", count: 2 }]} loaded />);

    await waitFor(() => expect(screen.getByTestId("value")).toHaveTextContent(/^reading$/));
  });

  it("keeps the order fixed while ticking", async () => {
    const user = userEvent.setup();
    render(
      <Tags
        initial={["writing"]}
        options={[{ tag: "listening" }, { tag: "reading" }, { tag: "writing" }]}
        loaded
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const names = () => screen.getAllByRole("option").map((option) => option.textContent);
    expect(names()).toEqual(["writing", "listening", "reading"]);

    await user.click(screen.getByRole("option", { name: "reading" }));
    expect(names()).toEqual(["writing", "listening", "reading"]);
  });
});

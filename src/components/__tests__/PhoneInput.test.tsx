import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PatchRecordDialog from "../PatchRecordDialog";
import { PhoneInput } from "../ui/phone-input";
import { I18nProvider } from "@/context/I18nContext";

function ControlledPhone({ required }: { required?: boolean }) {
  const [value, setValue] = useState("");
  return <PhoneInput aria-label="Phone" value={value} onChange={setValue} required={required} />;
}

function renderPhone(required?: boolean) {
  render(
    <I18nProvider>
      <ControlledPhone required={required} />
      <button type="button">elsewhere</button>
    </I18nProvider>,
  );
  return screen.getByLabelText("Phone");
}

describe("PhoneInput", () => {
  it("says nothing while typing, and flags a bad number once left", async () => {
    const user = userEvent.setup();
    const input = renderPhone();

    await user.type(input, "0985/0385");
    expect(screen.queryByText(/valid phone number/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(screen.getByText(/valid phone number/)).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts a local form, and asks for a required one left blank", async () => {
    const user = userEvent.setup();
    const input = renderPhone(true);

    await user.click(input);
    await user.click(screen.getByRole("button", { name: "elsewhere" }));
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();

    await user.type(input, "0912 345 678");
    expect(screen.queryByText(/required|valid phone/)).not.toBeInTheDocument();
    expect(input).toHaveAttribute("type", "tel");
  });
});

describe("PatchRecordDialog tel fields", () => {
  function renderDialog(initial: string, onSubmit = vi.fn()) {
    render(
      <I18nProvider>
        <PatchRecordDialog
          open
          title="Edit parent"
          fields={[
            { key: "number_phone", label: "Phone", type: "tel" },
            { key: "name", label: "Name", type: "text" },
          ]}
          initialValues={{ number_phone: initial, name: "Parent" }}
          onClose={() => undefined}
          onSubmit={onSubmit}
        />
      </I18nProvider>,
    );
    return onSubmit;
  }

  it("will not save a changed number that is not one", async () => {
    const user = userEvent.setup();
    renderDialog("");

    await user.type(screen.getByPlaceholderText("Phone"), "12345");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.clear(screen.getByPlaceholderText("Phone"));
    await user.type(screen.getByPlaceholderText("Phone"), "0912345678");
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("lets a record with an untouched legacy number be edited", async () => {
    const user = userEvent.setup();
    const onSubmit = renderDialog("0985/0385");

    await user.clear(screen.getByPlaceholderText("Name"));
    await user.type(screen.getByPlaceholderText("Name"), "Renamed");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Renamed" });
  });
});

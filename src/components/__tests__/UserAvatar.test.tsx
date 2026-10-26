import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UserAvatar, { userInitials } from "../UserAvatar";

describe("userInitials", () => {
    it("takes the first letter of the first two words", () => {
        expect(userInitials("nguyen van an")).toBe("NV");
        expect(userInitials("An")).toBe("A");
    });

    it("answers ? for no name", () => {
        expect(userInitials(null)).toBe("?");
        expect(userInitials("   ")).toBe("?");
    });
});

describe("UserAvatar", () => {
    it("shows the initials while there is no picture", () => {
        render(<UserAvatar user={{ name: "Tran Thi Binh", picture_url: null }} />);
        expect(screen.getByText("TT")).toBeTruthy();
    });

    it("shows ? while the user loads", () => {
        render(<UserAvatar user={null} />);
        expect(screen.getByText("?")).toBeTruthy();
    });
});

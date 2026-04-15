import { afterEach, describe, expect, it, vi } from "vitest";
import {
  filterAssignments,
  formatDateForInput,
  getUrgencyLabel,
  getUrgencyLevel,
} from "./utils/helpers";

afterEach(() => {
  vi.useRealTimers();
});

describe("assignment helpers", () => {
  it("formats dates for date inputs", () => {
    expect(formatDateForInput(new Date("2026-04-18T10:00:00Z"))).toBe("2026-04-18");
  });

  it("flags assignments due within a day as critical", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T00:00:00Z"));

    expect(getUrgencyLevel(new Date("2026-04-14T18:00:00Z"))).toBe("critical");
  });

  it("shows the exact number of days until the deadline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T00:00:00Z"));

    expect(getUrgencyLabel(new Date("2026-04-16T18:00:00Z"))).toBe("Due in 2 days");
  });

  it("filters assignments by subject and status", () => {
    const assignments = [
      { subject: "AI", status: "Pending" },
      { subject: "Finance", status: "Completed" },
      { subject: "AI", status: "Completed" },
    ];

    expect(
      filterAssignments(assignments, {
        subject: "AI",
        status: "Completed",
      })
    ).toEqual([{ subject: "AI", status: "Completed" }]);
  });
});

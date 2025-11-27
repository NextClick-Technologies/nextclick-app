import { cn } from "@/utils/cn";

describe("cn utility", () => {
  it("should merge single className", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("should merge multiple classNames", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classNames", () => {
    expect(cn("text-red-500", false && "hidden", "bg-blue-500")).toBe(
      "text-red-500 bg-blue-500"
    );
  });

  it("should merge conflicting Tailwind classes correctly", () => {
    // Later classes should override earlier ones
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("mt-2", "mt-4")).toBe("mt-4");
  });

  it("should handle objects with boolean values", () => {
    expect(
      cn({
        "text-red-500": true,
        "bg-blue-500": false,
        "p-4": true,
      })
    ).toBe("text-red-500 p-4");
  });

  it("should handle arrays of classNames", () => {
    expect(cn(["text-red-500", "bg-blue-500"])).toBe(
      "text-red-500 bg-blue-500"
    );
  });

  it("should handle mixed input types", () => {
    expect(
      cn(
        "text-red-500",
        ["bg-blue-500", "p-4"],
        { "mt-2": true, hidden: false },
        "rounded"
      )
    ).toBe("text-red-500 bg-blue-500 p-4 mt-2 rounded");
  });

  it("should handle undefined and null values", () => {
    expect(cn("text-red-500", undefined, null, "bg-blue-500")).toBe(
      "text-red-500 bg-blue-500"
    );
  });

  it("should handle empty strings", () => {
    expect(cn("", "text-red-500", "")).toBe("text-red-500");
  });

  it("should handle no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should trim extra whitespace", () => {
    expect(cn("  text-red-500  ", "  bg-blue-500  ")).toBe(
      "text-red-500 bg-blue-500"
    );
  });

  it("should merge complex Tailwind utility conflicts", () => {
    // Test responsive variants
    expect(cn("md:text-red-500", "md:text-blue-500")).toBe("md:text-blue-500");

    // Test hover states
    expect(cn("hover:bg-red-500", "hover:bg-blue-500")).toBe(
      "hover:bg-blue-500"
    );

    // Test multiple conflicts in one call
    expect(cn("text-red-500 bg-blue-500 p-4", "text-green-500 p-8")).toBe(
      "bg-blue-500 text-green-500 p-8"
    );
  });

  it("should preserve non-conflicting classes when merging", () => {
    expect(cn("text-red-500 font-bold underline", "text-blue-500 italic")).toBe(
      "font-bold underline text-blue-500 italic"
    );
  });

  it("should handle variant modifiers correctly", () => {
    expect(
      cn("dark:text-red-500 dark:bg-blue-500", "dark:text-green-500")
    ).toBe("dark:bg-blue-500 dark:text-green-500");
  });
});

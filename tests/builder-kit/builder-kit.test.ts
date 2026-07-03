import { describe, expect, it } from "vitest";
import { validateGamePackage } from "@packforge/core";
import {
  createGamePackageTemplate,
  createGamePackTemplate,
  exportBuilderPackage,
  importBuilderPackage
} from "@packforge/builder-kit";

describe("builder kit", () => {
  it("creates, validates, exports, and imports a starter game package", () => {
    const pack = createGamePackTemplate({
      id: "coffee-shop",
      title: "Coffee Shop Tycoon",
      subtitle: "Brew the first cup and grow from there."
    });
    const gamePackage = createGamePackageTemplate(
      "packforge.coffee-shop",
      "Coffee Shop Tycoon",
      pack
    );

    expect(validateGamePackage(gamePackage).errors).toEqual([]);

    const exported = exportBuilderPackage(gamePackage);
    expect(exported.ok).toBe(true);
    expect(exported.json).toContain("packforge.package.v1");

    const imported = importBuilderPackage(exported.json ?? "");
    expect(imported.validation.errors).toEqual([]);
    expect(imported.gamePackage.manifest.entryPackId).toBe("coffee-shop");
  });
});

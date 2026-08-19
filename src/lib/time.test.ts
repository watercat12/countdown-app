import { describe, it, expect } from "vitest";
import { parseDuration } from "./time";

describe("parseDuration", () => {
  describe("dot-notation", () => {
    it(".ss — seconds only", () => {
      expect(parseDuration(".45")).toBe(45);
      expect(parseDuration(".01")).toBe(1);
      expect(parseDuration(".59")).toBe(59);
    });

    it("0.ss — equivalent to .ss", () => {
      expect(parseDuration("0.45")).toBe(45);
      expect(parseDuration("0.01")).toBe(1);
    });

    it("mm.ss — minutes and seconds", () => {
      expect(parseDuration("5.30")).toBe(330);
      expect(parseDuration("1.20")).toBe(80);
      expect(parseDuration("0.59")).toBe(59);
    });

    it("hh.mm.ss — hours, minutes, seconds", () => {
      expect(parseDuration("1.20.30")).toBe(4830);
      expect(parseDuration("2.1.20")).toBe(7280);
      expect(parseDuration("0.0.45")).toBe(45);
      expect(parseDuration("0.5.30")).toBe(330);
    });

    it("rejects seconds >= 60", () => {
      expect(parseDuration(".60")).toBeNull();
      expect(parseDuration(".99")).toBeNull();
      expect(parseDuration("1.60")).toBeNull();
      expect(parseDuration("0.0.60")).toBeNull();
    });

    it("rejects minutes >= 60", () => {
      expect(parseDuration("60.0")).toBeNull();
      expect(parseDuration("1.60.0")).toBeNull();
    });

    it("rejects 4+ parts", () => {
      expect(parseDuration("1.2.3.4")).toBeNull();
      expect(parseDuration("1.2.3.4.5")).toBeNull();
    });

    it("rejects non-numeric parts", () => {
      expect(parseDuration("a.b")).toBeNull();
      expect(parseDuration("1.")).toBeNull();
      expect(parseDuration(".")).toBeNull();
    });

    it("rejects zero total", () => {
      expect(parseDuration("0.0")).toBeNull();
      expect(parseDuration("0.0.0")).toBeNull();
      expect(parseDuration(".0")).toBeNull();
    });

    it("rejects exceeding MAX_SECONDS", () => {
      expect(parseDuration("100.0.0")).toBeNull();
    });
  });

  describe("shorthand", () => {
    it("parses single units", () => {
      expect(parseDuration("30s")).toBe(30);
      expect(parseDuration("5m")).toBe(300);
      expect(parseDuration("1h")).toBe(3600);
    });

    it("parses combined units", () => {
      expect(parseDuration("2m30s")).toBe(150);
      expect(parseDuration("1h20s")).toBe(3620);
      expect(parseDuration("1h2m3s")).toBe(3723);
    });

    it("rejects invalid format", () => {
      expect(parseDuration("abc")).toBeNull();
      expect(parseDuration("30")).toBeNull();
    });

    it("rejects zero total", () => {
      expect(parseDuration("0s")).toBeNull();
    });
  });

  describe("common", () => {
    it("rejects empty input", () => {
      expect(parseDuration("")).toBeNull();
      expect(parseDuration("   ")).toBeNull();
    });

    it("trims whitespace", () => {
      expect(parseDuration("  5.30  ")).toBe(330);
      expect(parseDuration("  2m30s  ")).toBe(150);
    });

    it("rejects exceeding MAX_SECONDS", () => {
      expect(parseDuration("100h")).toBeNull();
    });
  });
});

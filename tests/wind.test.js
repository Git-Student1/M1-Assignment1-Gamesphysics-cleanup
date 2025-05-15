import { expect, test, vi } from "vitest";
import Wind from "../GameEngines Übung 11/wind";

test("Wind initializes with correct default values", () => {
	const wind = new Wind();
	expect(wind.speed).toBe(0);
});

test("updateSpeed changes speed to a random value within range", () => {
	const wind = new Wind();
	wind.updateSpeed();
	expect(wind.speed).toBeGreaterThanOrEqual(wind.__minValue);
	expect(wind.speed).toBeLessThanOrEqual(wind.__maxValue);
});

test("updateSize correctly updates size properties", () => {
	const wind = new Wind();
	wind.updateSize(50, 50, 100, 100, 12);
	expect(wind.windArrowBoxCenterX).toBe(50);
	expect(wind.windArrowBoxCenterY).toBe(50);
	expect(wind.windArrowBoxWidth).toBe(100);
	expect(wind.windArrowBoxHeight).toBe(100);
	expect(wind.arrowTextSize).toBe(12);
});

// Remove stubbed globals after the test
vi.unstubAllGlobals();

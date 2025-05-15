import { expect, test, vi } from "vitest";
import StartResetButton from "../GameEngines Übung 11/startResetButton"; // Adjust path if needed

test("StartResetButton initializes with correct default button text", () => {
	const button = new StartResetButton();
	expect(button.buttonText).toBe("Start");
});

test("inButton returns true when mouse is inside the button", () => {
	const button = new StartResetButton();
	button.updateSize(50, 50, 100, 100, 12); // Center at (50, 50), width and height 100
	expect(button.inButton(60, 60)).toBe(true);
});

test("inButton returns false when mouse is outside the button", () => {
	const button = new StartResetButton();
	button.updateSize(50, 50, 100, 100, 12);
	expect(button.inButton(160, 160)).toBe(false);
});

test("button text changes correctly", () => {
	const button = new StartResetButton();
	expect(button.buttonText).toBe("Start");
	button.changeText();
	expect(button.buttonText).toBe("Reset");
	button.changeText();
	expect(button.buttonText).toBe("Start");
});

test("updateSize updates button dimensions and text size", () => {
	const button = new StartResetButton();
	button.updateSize(100, 100, 150, 150, 14);
	expect(button.startbuttonCenterX).toBe(100);
	expect(button.startbuttonCenterY).toBe(100);
	expect(button.startbuttonWidth).toBe(150);
	expect(button.startbuttonHeight).toBe(150);
	expect(button.buttonTextSize).toBe(14);
});

// Remove all mocked globals
vi.unstubAllGlobals();

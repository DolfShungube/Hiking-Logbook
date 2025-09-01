// frontend/tests/HikePlanning.test.js
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HikePlanning from "../src/pages/HikePlanning";


// Mock the API module
jest.mock("../apiCalls/getWeather", () => ({
  getWeather: jest.fn(),
}));

import { getWeather } from "../apiCalls/getWeather";

describe("HikePlanning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays weather when API returns data", async () => {
    // Mock resolved value for getWeather
   getWeather.mockResolvedValue({
    current: { temp: 25, weather: [{ description: "Sunny" }] },
    daily: [
      {
        dt: new Date("2025-09-01").getTime() / 1000,
        temp: { day: 25 },
        weather: [{ description: "Sunny" }],
      },
    ],
  });


    render(<HikePlanning />);

    // Use getByLabelText since type="date" input is not a textbox
    const input = screen.getByLabelText(/select a date/i);
    fireEvent.change(input, { target: { value: "2025-09-01" } });

    // Wait for weather info to appear
    await waitFor(() => screen.getByText(/Temperature/i));

    expect(screen.getByText(/Temperature:\s*25/i)).toBeInTheDocument();
    expect(screen.getByText(/Condition:\s*Sunny/i)).toBeInTheDocument();

  });

  it("shows error if API fails", async () => {
    getWeather.mockRejectedValue(new Error("Network error"));

    render(<HikePlanning />);

    const input = screen.getByLabelText(/select a date/i);
    fireEvent.change(input, { target: { value: "2025-09-01" } });

    await waitFor(() =>
      screen.getByText("Could not fetch weather data")
    );

    expect(
      screen.getByText("Could not fetch weather data")
    ).toBeInTheDocument();
  });
});

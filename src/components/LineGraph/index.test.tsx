import { render, screen } from "@testing-library/react";
import LineGraph from ".";
import styles from "./index.module.css";

it("should be waiting for checking when no entries", () => {
  render(<LineGraph data={{}} />);
  expect(
    screen.queryByText("Check prefectures for showing graph")
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Loading Population Info:")
  ).not.toBeInTheDocument();
  expect(document.querySelector(`.${styles.graph}`)).not.toBeInTheDocument();
});

it("should be waiting for checking when no showed entries", () => {
  render(
    <LineGraph
      data={{ "2": { load: true, show: false, name: "Aomori", data: [] } }}
    />
  );
  expect(
    screen.queryByText("Check prefectures for showing graph")
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Loading Population Info:")
  ).not.toBeInTheDocument();
  expect(document.querySelector(`.${styles.graph}`)).not.toBeInTheDocument();
});

it("should have loading interface when no loaded entries", () => {
  render(
    <LineGraph
      data={{
        "2": {
          load: false,
          show: true,
          name: "Aomori",
          promise: Promise.resolve(),
        },
      }}
    />
  );
  expect(
    screen.queryByText("Check prefectures for showing graph")
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Loading Population Info:")).toBeInTheDocument();
  expect(document.querySelector(`.${styles.graph}`)).not.toBeInTheDocument();
});

it("should have graph interface when have loaded entries", () => {
  /** suppress warning of zero size rechartjs graph */
  const warnSuppressing = jest
    .spyOn(console, "warn")
    .mockImplementation(() => {});
  render(
    <LineGraph
      data={{
        "2": {
          load: true,
          show: true,
          name: "Aomori",
          data: [
            { value: 100, year: 1960 },
            { value: 100, year: 1970 },
          ],
        },
      }}
    />
  );
  warnSuppressing.mockRestore();
  expect(
    screen.queryByText("Check prefectures for showing graph")
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText("Loading Population Info:")
  ).not.toBeInTheDocument();
  expect(document.querySelector(`.${styles.graph}`)).toBeInTheDocument();
  expect(screen.queryByTestId("graph-2")).toBeInTheDocument();
});

it("should have graph interface and also loading banner when both loading and loaded entries", () => {
  /** suppress warning of zero size rechartjs graph */
  const warnSuppressing = jest
    .spyOn(console, "warn")
    .mockImplementation(() => {});
  render(
    <LineGraph
      data={{
        "1": {
          load: false,
          show: true,
          name: "Hokkaido",
          promise: Promise.resolve(),
        },
        "2": {
          load: true,
          show: true,
          name: "Aomori",
          data: [
            { value: 100, year: 1960 },
            { value: 100, year: 1970 },
          ],
        },
      }}
    />
  );
  warnSuppressing.mockRestore();
  expect(
    screen.queryByText("Check prefectures for showing graph")
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText("Loading Population Info:")
  ).not.toBeInTheDocument();
  expect(document.querySelector(`.${styles.graph}`)).toBeInTheDocument();
  expect(screen.queryByTestId("graph-2")).toBeInTheDocument();
  expect(screen.queryByTestId("graph-loading-1")).toBeInTheDocument();
});

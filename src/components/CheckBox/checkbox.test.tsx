import { fireEvent, render, screen } from "@testing-library/react";
import CheckBox from ".";
import CheckBoxArray from "./array";

it("renders checkbox", () => {
  render(<CheckBox id="a-check-box" name="Check Box" />);
  expect(screen.getByText("Check Box")).toBeInTheDocument();
});

it("reponses to callback", () => {
  let state = false;
  let callback = (checked: boolean) => (state = checked);
  render(<CheckBox id="a-check-box" name="Check Box" onChange={callback} />);
  fireEvent.click(screen.getByText("Check Box"));
  expect(state).toBe(true);
  fireEvent.click(screen.getByText("Check Box"));
  expect(state).toBe(false);
});

it("renders many checkboxes", () => {
  let state = false;
  let callback = (checked: boolean) => (state = checked);
  render(
    <CheckBoxArray
      arr={[
        { id: "a", name: "A" },
        { id: "b", name: "B", onChange: callback },
      ]}
    />
  );
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
  fireEvent.click(screen.getByText("B"));
  expect(state).toBe(true);
});

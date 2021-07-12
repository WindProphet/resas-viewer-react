import stringToColor from ".";

it("should return different color while different input", () => {
  const blue_color = stringToColor("blue");
  const cyan_color = stringToColor("cyan");
  expect(blue_color).not.toEqual(cyan_color);
});

it("should return same color with same input", () => {
  const blue_color1 = stringToColor("blue");
  const blue_color2 = stringToColor("blue");
  expect(blue_color1).toEqual(blue_color2);
});

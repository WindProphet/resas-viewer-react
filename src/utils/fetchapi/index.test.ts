import { checkError } from ".";

it("should return 400", () => {
  expect(checkError("400")).toBe("Bad Request");
});

it("should return 404", () => {
  expect(checkError("404")).toBe("Method Not Found");
  expect(
    checkError({
      statusCode: "404",
      message: "404. That's an error.",
      description: "The requested URL /404 was not found on this server.",
    })
  ).toBe("Method Not Found");
});

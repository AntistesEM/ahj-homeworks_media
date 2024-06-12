import { parseCoordinates } from "../Timeline";

describe("parseCoordinates", () => {
  it("should parse coordinates with a space", () => {
    const coords = parseCoordinates("51.50851, -0.12572");
    expect(coords).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should parse coordinates without a space", () => {
    const coords = parseCoordinates("51.50851,-0.12572");
    expect(coords).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should parse coordinates in square brackets", () => {
    const coords = parseCoordinates("[51.50851, -0.12572]");
    expect(coords).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should throw an error for invalid format", () => {
    expect(() => parseCoordinates("51.50851 -0.12572")).toThrowError(
      'Неверный формат координат: должно быть "широта, долгота"',
    );
  });

  it("should throw an error for invalid coordinates", () => {
    expect(() => parseCoordinates("foo, bar")).toThrowError(
      "Неверные координаты",
    );
    expect(() => parseCoordinates("91, 181")).toThrowError(
      "Неверные координаты",
    );
  });
});

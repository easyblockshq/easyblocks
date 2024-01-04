import { ComponentConfig } from "@easyblocks/core";
import { pasteManager } from "./manager";

describe("pasteManager", () => {
  const createConfigComponent = (
    init: Partial<ComponentConfig> = {}
  ): ComponentConfig => ({
    _template: "",
    ...init,
  });

  it("Call insert function on given destination", () => {
    const mockInsert = jest.fn();

    const destination = {
      name: "name1",
      index: 100,
      insert: mockInsert,
    };

    const item = createConfigComponent();

    const manager = pasteManager();

    const paste = manager([destination]);

    paste(item);

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith("name1", 100, item);
  });

  it("Call call insert until first successful insert", () => {
    const mockInsert = jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const name1 = "data.0.Component";
    const name2 = "data.0.Component.0.Stack";

    const destination1 = {
      name: name1,
      index: 100,
      insert: mockInsert,
    };
    const destination2 = {
      name: name2,
      index: 200,
      insert: mockInsert,
    };

    const item = createConfigComponent();

    const manager = pasteManager();

    const paste = manager([destination1, destination2]);

    paste(item);

    expect(mockInsert).toHaveBeenCalledTimes(2);
    expect(mockInsert).toHaveBeenNthCalledWith(1, name1, 100, item);
    expect(mockInsert).toHaveBeenNthCalledWith(2, name2, 200, item);
  });

  it("Call remember calls to the same destination and increment index", () => {
    const mockInsert = jest.fn().mockReturnValueOnce(true);

    const name = "data.0.Component";

    const destination1 = {
      name: name,
      index: 100,
      insert: jest.fn().mockReturnValueOnce(true),
    };

    const destination2 = {
      name: name,
      index: 100,
      insert: mockInsert,
    };

    const item = createConfigComponent();

    const manager = pasteManager();

    const paste1 = manager([destination1]);
    const paste2 = manager([destination2]);

    paste1(item);
    paste2(item);

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith(name, 101, item);
  });

  it("Call return first successful insert value", () => {
    const mockInsert = jest.fn().mockReturnValueOnce("data.0.Component.1337");

    const name = "data.0.Component";

    const destination1 = {
      name: name,
      index: 100,
      insert: mockInsert,
    };

    const manager = pasteManager();

    const paste1 = manager([destination1]);

    const result = paste1(createConfigComponent());
    expect(result).toEqual("data.0.Component.1337");
  });

  it("Call return null when no successful inserts ", () => {
    const mockInsert = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const manager = pasteManager();

    const paste1 = manager([
      {
        name: "data",
        index: 0,
        insert: mockInsert,
      },
      {
        name: "data.0.Component",
        index: 0,
        insert: mockInsert,
      },
      {
        name: "data.0.Component.0.Stack",
        index: 0,
        insert: mockInsert,
      },
    ]);

    const result = paste1(createConfigComponent());
    expect(result).toEqual(null);
  });
});

import { ApiAuthenticationStrategy, ApiClient } from "./apiClient";

const fetchMock = jest.fn();
const originalFetch = global.fetch;
global.fetch = fetchMock;

beforeEach(() => {
  fetchMock.mockReset();
});

afterAll(() => {
  global.fetch = originalFetch;
});

class TestAuthenticationStrategy implements ApiAuthenticationStrategy {
  get headerName() {
    return "x-test";
  }

  async getAccessToken(): Promise<string> {
    return "test-access-token";
  }
}

const apiClient = new ApiClient(new TestAuthenticationStrategy());

describe("search params", () => {
  test("it adds search params to the url when specified", async () => {
    await apiClient.get("/test", { searchParams: { foo: "1", bar: "2" } });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test?foo=1&bar=2"),
      expect.anything()
    );
  });

  test("it adds search params to the url when value is an array", async () => {
    await apiClient.get("/test", {
      searchParams: { foo: ["1", "2"] },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test?foo=1&foo=2"),
      expect.anything()
    );
  });

  test("it adds search params to the url when values are string and array", async () => {
    await apiClient.get("/test", {
      searchParams: { foo: "1", bar: ["2", "3"] },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test?foo=1&bar=2&bar=3"),
      expect.anything()
    );
  });
});

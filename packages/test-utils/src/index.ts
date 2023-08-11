import noop from "lodash/noop";

/**
 * Mocks given method of `console` object. If `implementation` is not given, it defaults to noop.
 */
function mockConsoleMethod<
  ConsoleMethodName extends Exclude<keyof Console, "Console">
>(
  methodName: ConsoleMethodName,
  implementation: (...args: Array<any>) => void = noop,
  options: { debug: boolean } = { debug: false }
) {
  const originalConsoleMethod = console[methodName];
  const mockedConsoleMethod = jest.spyOn(console, methodName);

  if (implementation) {
    // @ts-ignore
    mockedConsoleMethod.mockImplementation((...values: Array<unknown>) => {
      implementation(...values);

      if (options.debug) {
        // @ts-ignore
        originalConsoleMethod(...values);
      }
    });
  }

  return {
    mockedFn: mockedConsoleMethod,
    unmock: () => {
      mockedConsoleMethod.mockReset();
    },
  };
}

type MockedFn<Implementation extends (...args: any) => any> = jest.Mock<
  ReturnType<Implementation>,
  Parameters<Implementation>
>;

/**
 * Wrapper for `jest.fn` function, but with types which automatically infer parameters type and return type.
 * This is more handy for cases where the mocked function has its dedicated type.
 */
function mock<Implementation extends (...args: any) => any>(
  implementation: Implementation
): MockedFn<Implementation> {
  return jest.fn<ReturnType<Implementation>, Parameters<Implementation>>(
    implementation
  );
}

export { mock, mockConsoleMethod };
export type { MockedFn };

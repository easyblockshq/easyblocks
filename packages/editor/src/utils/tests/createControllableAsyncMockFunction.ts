import { act } from "react-dom/test-utils";

function getParamsKey(arg: any) {
  return arg
    .map((x: any) => JSON.stringify(x, Object.keys(x).sort()))
    .join(";");
}

export type ControllableMockAsyncFunction<
  T extends (...args: any[]) => any = any
> = {
  function: jest.Mock<Promise<T>, Parameters<T>>;
  resolve: (result?: Awaited<ReturnType<T>>) => Promise<void>;
  reject: (result?: Awaited<ReturnType<T>>) => Promise<void>;
  resolveForParams: (requested: any[], result?: T) => Promise<void>;
  rejectForParams: (requested: any[], error?: any) => Promise<void>;
};

/**
 * This helper creates a mock function that is async (returns Promise) but you can control in tests when and how it is resolved / rejected.
 *
 * 1. resolve and reject methods resolve or reject all the pending calls with given param.
 * 2. resolveForParams([...params], result) and rejectForParams([...params], error) resolves or rejects the specific promise that was called with "params".
 */
export function createControllableMockAsyncFunction(): ControllableMockAsyncFunction {
  const resolves: { [key: string]: any } = {};
  const rejects: { [key: string]: any } = {};

  const fun = (...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const key = getParamsKey(args);
      resolves[key] = resolve;
      rejects[key] = reject;
    });
  };

  return {
    function: jest.fn(fun),

    resolve: async (result?: any) => {
      for (const id in resolves) {
        const resolve = resolves[id];
        resolve(result);
        delete resolves[id];
      }

      await act(async () => {
        await new Promise(process.nextTick);
      });
    },

    reject: async (result?: any) => {
      for (const id in rejects) {
        const reject = rejects[id];
        reject(result);
        delete rejects[id];
      }
      await act(async () => {
        await new Promise(process.nextTick);
      });
    },

    resolveForParams: async (requested: any[], result?: any) => {
      const key = getParamsKey(requested);
      const resolve = resolves[key];

      if (!resolve) {
        console.error(
          `You're trying to resolve promise for input parameters`,
          requested,
          `It doesn't exist.`
        );
        throw new Error("error");
      }
      delete resolves[key];
      resolve(result);

      await act(async () => {
        await new Promise(process.nextTick);
      });
    },
    rejectForParams: async (requested: any[], error?: any) => {
      const key = getParamsKey(requested);
      const reject = rejects[key];
      if (!reject) {
        console.error(
          `You're trying to reject promise for input parameters`,
          requested,
          `It doesn't exist.`
        );
        throw new Error("error");
      }
      delete rejects[key];
      reject(error);
      await act(async () => {
        await new Promise(process.nextTick);
      });
    },
  };
}

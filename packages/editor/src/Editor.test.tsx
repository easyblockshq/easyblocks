import { noCMSPlugin } from "@easyblocks/media";
import { render, waitFor } from "@testing-library/react";
import React, { ComponentPropsWithoutRef } from "react";
import { Editor } from "./Editor";
import { createForm } from "./utils/tests";
import "@testing-library/jest-dom";

const mockForm = createForm();

jest.mock("./tinacms/react-core", () => {
  const originalModule = jest.requireActual("./tinacms/react-core");

  return Object.assign({ __esModule: true }, originalModule, {
    // @ts-ignore
    useForm: (props: any) => {
      mockForm.updateInitialValues(props.initialValues);
      return [mockForm.values, mockForm];
    },
  });
});

jest.mock("./infrastructure/supabaseClient", () => {
  return {
    supabaseClient: {},
    __esModule: true,
  };
});

beforeAll(() => {
  jest.spyOn(console, "debug").mockImplementation(() => {});
});

jest.useFakeTimers();

describe("Local and remote changes", () => {
  const CONFIG = {
    _template: "$RootSections",
    _id: "A",
  };

  const REMOTE_CONFIG = {
    _template: "$RootSections",
    _id: "REMOTE",
  };

  const props: ComponentPropsWithoutRef<typeof Editor> = {
    contextParams: {
      locale: "en",
    },
    locales: [
      {
        code: "en",
        isDefault: true,
      },
    ],
    save: () => Promise.resolve(),
    config: {
      resourceTypes: {},
      plugins: [noCMSPlugin],
    },
    onClose: () => {},
    configs: {
      en: CONFIG,
    },
  };

  const CONFIG_CHANGES_MESSAGE =
    "Remote changes detected, local changes have been overwritten.";

  // Skipped temporarily because of authentication
  it.skip("Should NOT display any notification when a remote change detected but no local changes occurred", async () => {
    const { queryByText, rerender } = render(<Editor {...props} />);

    expect(queryByText(CONFIG_CHANGES_MESSAGE)).not.toBeInTheDocument();

    rerender(
      <Editor
        {...props}
        configs={{
          en: REMOTE_CONFIG,
        }}
      />
    );

    await waitFor(() =>
      expect(queryByText(CONFIG_CHANGES_MESSAGE)).not.toBeInTheDocument()
    );
  });

  it.skip(`Should display "${CONFIG_CHANGES_MESSAGE}" when a remote and local changes occurred`, async () => {
    const { queryByText, rerender } = render(<Editor {...props} />);

    expect(queryByText(CONFIG_CHANGES_MESSAGE)).not.toBeInTheDocument();

    mockForm.change("_id", "LOCAL_CHANGE");

    rerender(
      <Editor
        {...props}
        configs={{
          en: REMOTE_CONFIG,
        }}
      />
    );

    await waitFor(() => {
      expect(queryByText(CONFIG_CHANGES_MESSAGE)).toBeInTheDocument();
    });
  });
});

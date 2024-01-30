import React, { MouseEvent, useEffect, useState } from "react";
import {
  OpenTemplateModalAction,
  OpenTemplateModalActionCreate,
} from "./types";
import {
  FormElement,
  ButtonDanger,
  ButtonPrimary,
  Input,
  Modal,
  useToaster,
} from "@easyblocks/design-system";
import { useEditorContext } from "./EditorContext";
import { Backend } from "@easyblocks/core";

type TemplateModalProps = {
  action: OpenTemplateModalAction;
  onClose: () => void;
  backend: Backend;
};

export const TemplateModal: React.FC<TemplateModalProps> = (props) => {
  const [error, setError] = useState<null | string>(null);
  const mode = props.action.mode;
  const backend = props.backend;

  const editorContext = useEditorContext();
  const [isLoadingEdit, setLoadingEdit] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);

  const toaster = useToaster();
  const [template, setTemplate] = useState(() => {
    if (props.action.mode === "edit") {
      return props.action.template;
    } else {
      return {
        label: "",
        entry: props.action.config,
      };
    }
  });

  const label = template.label ?? "";
  const open = props.action !== undefined;
  const canSend = label.trim() !== "";
  const ctaLabel = "Save";

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  return (
    <Modal
      title={`Template details`}
      isOpen={true}
      onRequestClose={() => {
        props.onClose();
      }}
      mode={"center-small"}
      headerLine={true}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          setError(null);

          if (!canSend) {
            return;
          }

          setLoadingEdit(true);

          if (mode === "create") {
            const createAction = props.action as OpenTemplateModalActionCreate;

            backend.templates
              .create({
                label,
                entry: createAction.config,
                width: createAction.width,
                widthAuto: createAction.widthAuto,
              })
              .then(() => {
                editorContext.syncTemplates();
                toaster.success("Template created!");
                props.onClose();
              })
              .catch(() => {
                toaster.error("Couldn't save template");
              })
              .finally(() => {
                setLoadingEdit(false);
              });
          } else {
            backend.templates
              .update({
                label,
                id: template.id!,
              })
              .then(() => {
                editorContext.syncTemplates();
                toaster.success("Template updated!");
                props.onClose();
              })
              .catch(() => {
                toaster.error("Couldn't update template");
              })
              .finally(() => {
                setLoadingEdit(false);
              });
          }
        }}
      >
        {error && <div>{error}</div>}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <FormElement name={"label"} label={"Template name"}>
            <Input
              placeholder={"My template name"}
              required={true}
              value={label}
              onChange={(e) => {
                setTemplate({
                  ...template,
                  label: e.target.value,
                });
              }}
              withBorder={true}
              autoFocus
            />
          </FormElement>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <div>
              {mode === "edit" && (
                <ButtonDanger
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();

                    setLoadingDelete(true);

                    backend.templates
                      .delete({ id: template.id! })
                      .then(() => {
                        editorContext.syncTemplates();
                        toaster.success("Template deleted");
                        props.onClose();
                      })
                      .catch(() => {
                        toaster.error("Couldn't delete template");
                      })
                      .finally(() => {
                        setLoadingDelete(false);
                      });
                  }}
                  isLoading={isLoadingDelete}
                >
                  Delete
                </ButtonDanger>
              )}
            </div>

            <ButtonPrimary
              type={"submit"}
              disabled={!canSend}
              isLoading={isLoadingEdit}
            >
              {ctaLabel}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </Modal>
  );
};

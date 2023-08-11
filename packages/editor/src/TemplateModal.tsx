import React, { MouseEvent, useEffect, useState } from "react";
import {
  OpenTemplateModalAction,
  OpenTemplateModalActionCreate,
  RoleMaster,
} from "./types";
import {
  FormElement,
  SSButtonDanger,
  SSButtonPrimary,
  SSInput,
  SSModal,
  SSToggle,
  useToaster,
} from "@easyblocks/design-system";
import { useEditorContext } from "./EditorContext";
import { findComponentDefinitionById } from "@easyblocks/app-utils";
import { findRolesInTags } from "./findRole";
import { useApiClient } from "./infrastructure/ApiClientProvider";

export type TemplateModalProps = {
  action: OpenTemplateModalAction;
  onClose: () => void;
};

export const TemplateModal: React.FC<TemplateModalProps> = (props) => {
  const [error, setError] = useState<null | string>(null);
  const apiClient = useApiClient();
  const mode = props.action.mode;

  const config =
    props.action.mode === "edit"
      ? props.action.template.config
      : props.action.config;

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
        config: props.action.config,
      };
    }
  });
  const [rolesOpen, setRolesOpen] = useState(false);

  const [selectedMasterTemplateIds, setSelectedMasterTemplateIds] = useState(
    () => {
      if (props.action.mode === "edit") {
        const mapTo = props.action.template.mapTo ?? [];
        if (Array.isArray(mapTo)) {
          return mapTo;
        }
        return [mapTo];
      }
      return [];
    }
  );

  const roles = findRolesInTags(
    findComponentDefinitionById(config._template, editorContext)!.tags
  );

  const masters: RoleMaster[] = [];
  roles.forEach((role) => {
    if (role.masters) {
      masters.push(...role.masters);
    }
  });

  const label = template.label ?? "";
  const open = props.action !== undefined;
  const canSend = label.trim() !== "";
  const ctaLabel = "Save";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "m" && e.shiftKey && e.metaKey) {
        e.preventDefault();
        setRolesOpen(true);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  if (!editorContext.project) {
    throw new Error(
      "Trying to access templates feature without specifying project id. This is an unexpected error state."
    );
  }

  const projectId = editorContext.project.id;

  return (
    <SSModal
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

          const selectedMasterIds: string[] = [];

          masters.forEach(({ id }) => {
            const isSelected =
              (e.target as any)["master__" + id]?.checked ?? false;
            if (isSelected) {
              selectedMasterIds.push(id);
            }
          });

          setError(null);

          if (!canSend) {
            return;
          }

          setLoadingEdit(true);

          let payload: Record<string, any>;
          let method: "POST" | "PUT";
          let url: string;
          let successMessage: string;

          if (mode === "create") {
            const createAction = props.action as OpenTemplateModalActionCreate;

            payload = {
              label,
              config: createAction.config,
              masterTemplateIds: selectedMasterIds,
              width: createAction.width,
              widthAuto: createAction.widthAuto,
            };

            method = "POST";
            url = `/projects/${projectId}/templates`;
            successMessage = "Template created";
          } else {
            payload = {
              label,
              masterTemplateIds: selectedMasterIds,
            };
            method = "PUT";
            url = `/projects/${projectId}/templates/${template.id!}`;
            successMessage = "Template edited";
          }

          apiClient
            .request(url, {
              method,
              body: JSON.stringify(payload),
            })
            .then((response) => {
              response.json().then(() => {
                if (response.status !== 200) {
                  toaster.error("Couldn't save template");
                } else {
                  editorContext.syncTemplates();
                  toaster.success(successMessage);
                  props.onClose();
                }
              });
            })
            .catch((err) => {
              toaster.error("Couldn't save template");
            })
            .finally(() => {
              setLoadingEdit(false);
            });
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
            <SSInput
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

          {masters.map(
            ({ id, alwaysVisible, label }) =>
              (rolesOpen || alwaysVisible) && (
                <FormElement name={"master__" + id} label={label}>
                  <SSToggle
                    checked={selectedMasterTemplateIds.includes(id)}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      if (!checked) {
                        setSelectedMasterTemplateIds(
                          selectedMasterTemplateIds.filter((id) => id !== id)
                        );
                      } else if (
                        checked &&
                        !selectedMasterTemplateIds.includes(id)
                      ) {
                        setSelectedMasterTemplateIds([
                          ...selectedMasterTemplateIds,
                          id,
                        ]);
                      }
                    }}
                  />
                </FormElement>
              )
          )}

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
                <SSButtonDanger
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();

                    setLoadingDelete(true);

                    apiClient
                      .request(
                        `/projects/${projectId}/templates/${template.id!}`,
                        {
                          method: "DELETE",
                        }
                      )
                      .then((response) => {
                        response.json().then(() => {
                          if (response.status !== 200) {
                            toaster.error("Couldn't delete template");
                          } else {
                            editorContext.syncTemplates();
                            toaster.success("Template deleted");
                            props.onClose();
                          }
                        });
                      })
                      .catch((err) => {
                        toaster.error("Couldn't delete template");
                      })
                      .finally(() => {
                        setLoadingDelete(false);
                      });
                  }}
                  isLoading={isLoadingDelete}
                >
                  Delete
                </SSButtonDanger>
              )}
            </div>

            <SSButtonPrimary
              type={"submit"}
              disabled={!canSend}
              isLoading={isLoadingEdit}
            >
              {ctaLabel}
            </SSButtonPrimary>
          </div>
        </div>
      </form>
    </SSModal>
  );
};

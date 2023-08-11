import { getDefaultConfig } from "@easyblocks/app-utils";
import {
  ContextParams,
  Locale,
  DocumentDTO,
  ComponentConfig,
} from "@easyblocks/core";
import {
  IconButtonPrimary,
  Loader,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  ShopstoryLogo,
  SSButtonDanger,
  SSButtonGhost,
  SSButtonPrimary,
  SSButtonSecondary,
  SSColors,
  SSIcons,
  SSInput,
  SSModal,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
  useToaster,
} from "@easyblocks/design-system";
import { useUser } from "@supabase/auth-helpers-react";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { getComponentConfigPreviewImageURL } from "../configComponentPreview";
import { useApiClient } from "../infrastructure/ApiClientProvider";
import { supabaseClient } from "../infrastructure/supabaseClient";

function Dashboard(props: {
  project: { id: string; name: string; token: string };
  locales: Array<Locale>;
  contextParams: ContextParams;
  normalizeConfig: (config: ComponentConfig) => ComponentConfig;
}) {
  const user = useUser();
  const [activeTab, setActiveTab] = useState("documents");

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div
      css={css`
        min-height: 100vh;
      `}
    >
      <Sidebar>
        <ShopstoryLogo />
        <Stack
          css={`
            margin-top: auto;
          `}
          gap={16}
          align="start"
        >
          {user.email !== undefined && (
            <Typography color="black500">{user.email}</Typography>
          )}
          <SSButtonSecondary
            onClick={() => {
              supabaseClient.auth.signOut();
            }}
          >
            Logout
          </SSButtonSecondary>
        </Stack>
      </Sidebar>
      <MainContent>
        <div
          css={`
            margin: 0 auto;
            max-width: 1000px;
          `}
        >
          <Typography
            component="h1"
            css={`
              font-size: 22px;
              margin-bottom: 72px;
            `}
          >
            {props.project.name}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(tabValue) => {
              setActiveTab(tabValue);
            }}
          >
            <TabList
              action={
                activeTab !== "project-details" ? (
                  <CreateNewDocumentButton
                    projectId={props.project.id}
                    normalizeConfig={props.normalizeConfig}
                  />
                ) : null
              }
            >
              <Tab value="documents">Documents</Tab>
              <Tab value="project-details">Project details</Tab>
            </TabList>
            <TabPanel value="documents">
              <DocumentsListTabPanel
                contextParams={props.contextParams}
                locales={props.locales}
                project={props.project}
                normalizeConfig={props.normalizeConfig}
              />
            </TabPanel>
            <TabPanel value="project-details">
              <DocumentDetailsTabPanel project={props.project} />
            </TabPanel>
          </Tabs>
        </div>
      </MainContent>
    </div>
  );
}

export { Dashboard };

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid ${SSColors.black10};
  box-sizing: border-box;
`;

const MainContent = styled.div`
  padding: 72px 122px 72px calc(112px + 240px);
`;

function DocumentsListTabPanel(props: {
  project: { id: string; name: string; token: string };
  locales: Array<Locale>;
  contextParams: ContextParams;
  normalizeConfig: (config: ComponentConfig) => ComponentConfig;
}) {
  const { data: documents, status } = useDocumentsByProjectIdQuery(
    props.project.id
  );

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: repeat(3, 300px);
        gap: 36px;
        margin-top: 36px;
      `}
    >
      {status === "loading" && <Loader />}

      {status === "success" && documents.length === 0 && (
        <DocumentPlaceholderCard
          projectId={props.project.id}
          normalizeConfig={props.normalizeConfig}
        />
      )}

      {status === "success" &&
        documents.length > 0 &&
        documents.map((d) => {
          const previewImageUrl = getComponentConfigPreviewImageURL({
            configId: d.config_id,
            project: props.project,
            version: d.version,
            locales: props.locales,
            contextParams: props.contextParams,
          });

          return (
            <DocumentCard
              document={d}
              previewImageUrl={previewImageUrl}
              key={d.id}
            />
          );
        })}

      {status === "error" && (
        <Typography>Error while loading documents</Typography>
      )}
    </div>
  );
}

function useIsCreateDocumentMutationRunning() {
  return useIsMutating({ mutationKey: ["createDocument"] }) > 0;
}

function CreateNewDocumentButton(props: {
  projectId: string;
  normalizeConfig: (config: ComponentConfig) => ComponentConfig;
}) {
  const createNewDocumentMutation = useCreateNewDocumentMutation(
    props.projectId,
    props.normalizeConfig
  );
  const isCreateDocumentMutationRunning = useIsCreateDocumentMutationRunning();

  return (
    <SSButtonPrimary
      variant="large"
      icon={SSIcons.Add}
      isLoading={createNewDocumentMutation.isLoading}
      disabled={isCreateDocumentMutationRunning}
      onClick={() => {
        createNewDocumentMutation.mutate();
      }}
    >
      New document
    </SSButtonPrimary>
  );
}

function DocumentPlaceholderCard(props: {
  projectId: string;
  normalizeConfig: (config: ComponentConfig) => ComponentConfig;
}) {
  const createDocumentMutation = useCreateNewDocumentMutation(
    props.projectId,
    props.normalizeConfig
  );
  const isCreateDocumentMutationRunning = useIsCreateDocumentMutationRunning();

  return (
    <div
      css={`
        display: grid;
        place-items: center;
        height: 300px;
        width: 300px;
        background-color: ${SSColors.blue10};

        @media (hover: hover) {
          cursor: pointer;
        }
      `}
      onClick={() => {
        if (isCreateDocumentMutationRunning) {
          return;
        }

        createDocumentMutation.mutate();
      }}
    >
      <Stack
        gap={24}
        css={`
          align-items: center;
        `}
      >
        <IconButtonPrimary icon={SSIcons.Add} variant="large" />
        <Typography color="blue50">Add your first document</Typography>
      </Stack>
    </div>
  );
}

function useDocumentsByProjectIdQuery(projectId: string) {
  const apiClient = useApiClient();
  const query = useQuery({
    queryKey: ["documents", projectId],
    queryFn: async () => {
      const documents = await apiClient.documents.getDocuments({ projectId });
      return documents;
    },
  });

  return query;
}

function useCreateNewDocumentMutation(
  projectId: string,
  normalizeConfig: (config: ComponentConfig) => ComponentConfig
) {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createDocument"],
    mutationFn: async () => {
      return await apiClient.documents.createDocument({
        projectId,
        title: "Untitled",
        config: normalizeConfig(getDefaultConfig("content")),
        source: "nocms",
        rootContainer: "content",
      });
    },
    onSuccess: (document) => {
      queryClient.invalidateQueries(["documents", projectId]);
      navigate(`/editor?documentId=${document.id}`);
    },
  });

  return mutation;
}

function DocumentCard(props: {
  document: DocumentDTO;
  previewImageUrl: string | undefined;
}) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDocumentIdOpen, setIsDocumentIdOpen] = useState(false);
  const [dateTimeFormatter] = useState(
    () =>
      new Intl.DateTimeFormat("en", {
        dateStyle: "short",
        timeStyle: "short",
      })
  );
  const navigate = useNavigate();

  return (
    <Stack
      gap={8}
      css={`
        position: relative;
      `}
    >
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          navigate(`/editor?documentId=${props.document.id}`);
        }}
        css={`
          position: absolute;
          left: 0;
          top: 0;
          width: 300px;
          height: 300px;
          display: block;
          opacity: 0;
        `}
      />
      <img
        src={props.previewImageUrl}
        alt={`${props.document.title} document preview`}
        loading="lazy"
        css={`
          display: block;
          width: 300px;
          height: 300px;
          object-fit: contain;
          background-color: ${SSColors.black5};
        `}
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Stack gap={4}>
          <Typography>{props.document.title}</Typography>
          <Typography color="black40">
            Last updated at:{" "}
            {dateTimeFormatter.format(new Date(props.document.updated_at))}
          </Typography>
        </Stack>
        <Menu>
          <MenuTrigger>
            <SSButtonGhost icon={SSIcons.ThreeDotsHorizontal} hideLabel />
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              onClick={() => {
                setIsRenameModalOpen(true);
              }}
            >
              <Typography color="white">Rename</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsDocumentIdOpen(true);
              }}
            >
              <Typography color="white">Show document ID</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
            >
              <Typography color="red">Delete</Typography>
            </MenuItem>
          </MenuContent>
        </Menu>

        {isRenameModalOpen && (
          <RenameDocumentModal
            document={props.document}
            onClose={() => {
              setIsRenameModalOpen(false);
            }}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteDocumentModal
            document={props.document}
            onClose={() => {
              setIsDeleteModalOpen(false);
            }}
          />
        )}

        {isDocumentIdOpen && (
          <ShowDocumentIdModal
            document={props.document}
            onClose={() => {
              setIsDocumentIdOpen(false);
            }}
          />
        )}
      </div>
    </Stack>
  );
}

function RenameDocumentModal(props: {
  document: DocumentDTO;
  onClose: () => void;
}) {
  const updateDocumentTitleMutation = useUpdateDocumentTitleMutation({
    documentId: props.document.id,
    projectId: props.document.project_id,
    onSuccess: () => {
      props.onClose();
    },
  });

  return (
    <SSModal
      isOpen
      mode="center-small"
      headerLine
      title="Rename document"
      maxHeight="auto"
      onRequestClose={props.onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const title = formData.get("title")!;
          updateDocumentTitleMutation.mutate({ newTitle: title.toString() });
        }}
      >
        <Stack gap={24} align="stretch">
          <SSInput
            name="title"
            defaultValue={props.document.title}
            placeholder="New document title"
            aria-label="New document title"
            required
            css={`
              &:not(input) {
                border: 1px solid ${SSColors.black10};
                height: 36px;
              }
            `}
          />
          <SSButtonPrimary
            type="submit"
            variant="large"
            isLoading={updateDocumentTitleMutation.isLoading}
          >
            Save
          </SSButtonPrimary>
        </Stack>
      </form>
    </SSModal>
  );
}

function useUpdateDocumentTitleMutation(props: {
  documentId: string;
  projectId: string;
  onSuccess: () => void;
}) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ newTitle }: { newTitle: string }) => {
      return apiClient.documents.updateDocument({
        documentId: props.documentId,
        projectId: props.projectId,
        title: newTitle,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", props.projectId]);
      props.onSuccess();
    },
  });

  return mutation;
}

function DeleteDocumentModal(props: {
  document: DocumentDTO;
  onClose: () => void;
}) {
  const deleteDocumentMutation = useDeleteDocumentMutation({
    projectId: props.document.project_id,
    documentId: props.document.id,
  });

  return (
    <SSModal
      isOpen
      mode="center-small"
      headerLine
      title={`Delete ${props.document.title} document?`}
      maxHeight="auto"
      onRequestClose={props.onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          deleteDocumentMutation.mutate();
        }}
      >
        <Stack gap={24}>
          <Typography>
            This will permanently delete the document {props.document.title}.
          </Typography>
          <SSButtonDanger
            type="submit"
            variant="large"
            isLoading={deleteDocumentMutation.isLoading}
          >
            Delete document
          </SSButtonDanger>
        </Stack>
      </form>
    </SSModal>
  );
}

function useDeleteDocumentMutation(props: {
  projectId: string;
  documentId: string;
}) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const deleteDocumentMutation = useMutation({
    mutationKey: ["deleteDocument", props.documentId],
    mutationFn: async () => {
      const deleteProjectResponse = await apiClient.delete(
        `/projects/${props.projectId}/documents/${props.documentId}`
      );

      if (deleteProjectResponse.ok) {
        queryClient.invalidateQueries(["documents", props.projectId]);
      }
    },
  });

  return deleteDocumentMutation;
}

function ShowDocumentIdModal(props: {
  document: DocumentDTO;
  onClose: () => void;
}) {
  const toaster = useToaster();

  return (
    <SSModal
      isOpen
      mode="center-small"
      headerLine
      title="Document ID"
      maxHeight="auto"
      onRequestClose={props.onClose}
    >
      <Stack gap={24}>
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        >
          <Typography
            css={`
              width: 100%;
            `}
          >
            {props.document.id}
          </Typography>
          <SSButtonGhost
            onClick={() => {
              navigator.clipboard.writeText(props.document.id).then(() => {
                toaster.success("Copied document ID to clipboard");
              });
            }}
          >
            Copy
          </SSButtonGhost>
        </div>
        <SSButtonPrimary variant="large" onClick={props.onClose}>
          Done
        </SSButtonPrimary>
      </Stack>
    </SSModal>
  );
}

function DocumentDetailsTabPanel(props: {
  project: { id: string; name: string; token: string };
}) {
  const toaster = useToaster();

  return (
    <div
      css={`
        margin-top: 36px;
      `}
    >
      <hr
        css={`
          all: unset;
          display: block;
          width: 100%;
          height: 1px;
          margin-bottom: 48px;
          background-color: ${SSColors.black10};
        `}
      />
      <div
        css={`
          display: grid;
          grid-template-columns: 240px 1fr;
          row-gap: 48px;
        `}
      >
        <Typography>Project ID</Typography>
        <Typography>{props.project.id}</Typography>
        <Typography>Token</Typography>
        <Stack gap={16} align="start">
          <Typography
            css={`
              word-break: break-all;
            `}
          >
            {props.project.token}
          </Typography>
          <SSButtonGhost
            onClick={() => {
              navigator.clipboard.writeText(props.project.token).then(() => {
                toaster.success("Copied token to clipboard");
              });
            }}
          >
            Copy
          </SSButtonGhost>
        </Stack>
      </div>
    </div>
  );
}

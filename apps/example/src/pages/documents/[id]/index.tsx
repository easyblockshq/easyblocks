import { Metadata, RenderableContent, ShopstoryClient } from "@easyblocks/core";
import {
  builtinClientOnlyEditableComponents,
  builtinEditableComponentsDefinitions,
} from "@easyblocks/editable-components";
import {
  Shopstory,
  ShopstoryMetadataProvider,
  ShopstoryProvider,
} from "@easyblocks/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { createApiClient } from "../../../app/lib/apiClient";

function DocumentPage({
  content,
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ShopstoryProvider components={builtinClientOnlyEditableComponents()}>
      <ShopstoryMetadataProvider meta={meta}>
        <Shopstory content={content} />
      </ShopstoryMetadataProvider>
    </ShopstoryProvider>
  );
}

export default DocumentPage;

export const getServerSideProps: GetServerSideProps<
  { content: RenderableContent; meta: Metadata },
  { id: string }
> = async (context) => {
  const { id } = context.params ?? {};

  const apiClient = createApiClient();

  if (!id) {
    return {
      notFound: true,
    };
  }

  const document = await apiClient.documents.getDocumentById({
    projectId: "89ed48c6-dc0b-4936-9a97-4eb791396853",
    documentId: id,
  });

  if (document === null) {
    return {
      notFound: true,
    };
  }

  const shopstoryClient = new ShopstoryClient(
    {
      components: builtinEditableComponentsDefinitions,
      rootContainers: {
        content: {
          defaultConfig: {
            _template: "$RootSections",
            data: [],
          },
        },
      },
      accessToken:
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ??
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NjE5NTM2NzMsImV4cCI6MTY5MzQ4OTY3MywiYXVkIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEyMyIsImVtYWlsIjoibWljaGFsQHNob3BzdG9yeS5hcHAiLCJwcm9qZWN0X2lkIjoiODllZDQ4YzYtZGMwYi00OTM2LTlhOTctNGViNzkxMzk2ODUzIn0.3I9QMjhPkYHtzW19g-uIjattobPBiXEK0Fz4AwxEfQg",
    },
    { locale: "en-US" }
  );

  const content = shopstoryClient.add(document.config.config);
  const meta = await shopstoryClient.build();

  return {
    props: {
      content,
      meta,
    },
  };
};

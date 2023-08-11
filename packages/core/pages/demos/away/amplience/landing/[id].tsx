import { ConfigComponent } from "@easyblocks/utils";
import { ContentBody, ContentClient } from "dc-delivery-sdk-js";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { amplienceConfig } from "../../../../../src/cms/amplience/config";
// import { amplienceClientSetup } from "../../../../../src/cms/amplience/clientSetup";
import { ShopstoryClient } from "../../../../../src/client";
import {
  RenderableContent,
  Metadata,
  isRenderableContent,
} from "../../../../../src";
import { isComponentConfig } from "../../../../../src/isComponentConfig";

import {
  Shopstory,
  ShopstoryMetadataProvider,
  ShopstoryProvider,
} from "../../../../../src/react";

function PreviewPage({
  blocks,
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ShopstoryProvider>
      <ShopstoryMetadataProvider meta={meta}>
        {blocks.map((block) => {
          if (isRenderableContent(block)) {
            return <Shopstory content={block} />;
          }

          // Currently not supported here
          return null;
        })}
      </ShopstoryMetadataProvider>
    </ShopstoryProvider>
  );
}

export const getServerSideProps: GetServerSideProps<{
  blocks: Array<RenderableContent>;
  meta: Metadata;
}> = async (context) => {
  const contentId = context.params?.id;

  if (!contentId || Array.isArray(contentId)) {
    return {
      notFound: true,
    };
  }

  const contentClient = new ContentClient({
    apiKey: "sSChWx9ypl8NiXbvGBNqeaKcTtcYXtbwaVi0VGfU",
    hubName: "shopstory",
    locale: "en-GB",
  });

  try {
    const content = await contentClient.getContentItemById<
      ContentBody & { blocks: Array<ConfigComponent | Record<string, unknown>> }
    >(contentId);

    const shopstoryClient = new ShopstoryClient(
      amplienceConfig,
      // amplienceClientSetup({
      //   hubName: "shopstory",
      //   stagingEnvironment: "kcdz62c7ygpi1th4bzrptv6z4.staging.bigcontent.io",
      //   useUnpublishedContent: true,
      // }),
      {
        mode: "content",
        locale: "en-GB",
      }
    );

    const blocks = content.body.blocks
      .filter((block) => {
        return isComponentConfig(block.config);
      })
      .map((block) => {
        return shopstoryClient.add(block.config);
      });

    const meta = await shopstoryClient.build();

    return {
      props: {
        blocks,
        meta,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default PreviewPage;

import React, { useState, useEffect, useRef } from "react";
import { SSButtonGhost } from "./buttons";
import { SSBasicRow } from "./rows/BasicRow";
import { SSModal } from "./modals/Modal";
import { SSColors } from "./colors";
import { SSIcons } from "./icons";
import { SSFonts } from "./fonts";
import styled, { css, keyframes } from "styled-components";
import debounce from "lodash/debounce";
import { ThumbnailButton } from "./ThumbnailButton";

type ProductType = {
  id: string;
  title: string;
  thumbnail?: string;
};

export interface SSProductPickerAPI {
  products: (query: string) => Promise<ProductType[]>;
  product: (id: string) => Promise<ProductType>;
}

type ProductPickerProps = {
  value:
    | { id: string; variant?: string; info?: Record<string, unknown> }
    | { id: null; variant?: string };
  onChange: (product: { id: string | null; key?: string }) => void;
  api: SSProductPickerAPI;
  clearable?: boolean;
};

function getProductFromId(
  id: string,
  api: SSProductPickerAPI
): Promise<ProductType> {
  return new Promise<ProductType>((resolve, reject) => {
    const cached = getProductFromCache(id);

    if (cached) {
      resolve(cached);
    }

    api.product(id).then(
      (product) => {
        resolve(product);
      },
      () => {
        reject();
      }
    );
  });
}

const productCache: { [key: string]: ProductType } = {};

function getProductFromCache(id: string | null): ProductType | null {
  if (!id) {
    return null;
  }

  if (productCache[id]) {
    return productCache[id];
  }

  return null;
}

function saveProductToCache(product: ProductType) {
  productCache[product.id] = product;
}

type ProductPickerState = "unknown" | "error" | "success" | "loading";

type ProductApiRequestState =
  | { status: "idle"; data: undefined; error: null }
  | { status: "loading"; data: Array<ProductType> | undefined; error: null }
  | { status: "success"; data: Array<ProductType>; error: null }
  | { status: "error"; data: undefined; error: any };

export const SSProductPicker: React.FC<ProductPickerProps> = ({
  value,
  onChange,
  api,
  clearable = false,
}) => {
  const [product, setProduct] = useState<ProductType | null>(
    getProductFromCache(value.id)
  );
  const [isOpen, setOpen] = useState(false);
  const [state, setState] = useState<ProductPickerState>("unknown");

  function error() {
    setProduct(null);
    setState("error");
  }

  useEffect(() => {
    if (product?.id === value.id) {
      return;
    }

    if (!value.id) {
      setProduct(null);
      return;
    }

    let isMounted = true;

    getProductFromId(value.id, api).then(
      (product) => {
        if (!isMounted) {
          return;
        }

        if (product === null || product === undefined) {
          error();
        } else {
          if (!isMounted) {
            return;
          }

          setProduct(product);
          saveProductToCache(product);
          setState("success");
        }
      },
      () => {
        if (!isMounted) {
          return;
        }

        error();
      }
    );

    return () => {
      isMounted = false;
    };
  }, [value]);

  return (
    <div
      css={`
        width: 100%;
      `}
    >
      {state === "error" && (
        <ErrorMessage>Couldn't fetch data for id: {value.id}</ErrorMessage>
      )}

      <div
        css={`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <ThumbnailButton
          thumbnail={
            product?.thumbnail
              ? {
                  type: "image",
                  src: product.thumbnail,
                }
              : undefined
          }
          label={
            state === "loading"
              ? "Loading..."
              : product?.title ?? "Pick an item"
          }
          onClick={() => {
            setOpen(true);
          }}
        />

        {product && clearable && (
          <SSButtonGhost
            icon={SSIcons.Remove}
            hideLabel
            onClick={() => {
              onChange({ id: null, key: undefined });
            }}
          >
            Clear
          </SSButtonGhost>
        )}

        <ItemPickerModal
          key={value.variant}
          isOpen={isOpen}
          getItems={api.products}
          onClose={() => {
            setOpen(false);
          }}
          onItemPick={(item) => {
            onChange({ id: item.id });
          }}
        />
      </div>
    </div>
  );
};

interface ProductPickerModalProps {
  isOpen: boolean;
  getItems: SSProductPickerAPI["products"];
  onClose: () => void;
  onItemPick: (item: ProductType) => void;
}

function ItemPickerModal({
  isOpen,
  getItems,
  onClose,
  onItemPick,
}: ProductPickerModalProps) {
  const [query, setQuery] = useState<string>("");
  const previousQuery = useRef<string | undefined>();

  const [getProductsRequest, setGetProductsRequest] =
    useState<ProductApiRequestState>({
      status: "idle",
      data: undefined,
      error: null,
    });

  useEffect(() => {
    previousQuery.current = query;
  }, [query]);

  useEffect(() => {
    if (!isOpen && query !== "") {
      setQuery("");
    }
  }, [isOpen, query]);

  useEffect(() => {
    let loadingTimeoutId: number;
    let isCanceled = false;

    const debouncedGetProducts = debounce((query: string) => {
      loadingTimeoutId = window.setTimeout(() => {
        setGetProductsRequest({
          status: "loading",
          data: getProductsRequest.data,
          error: null,
        });
      }, 1000);

      getItems(query)
        .then((products) => {
          setGetProductsRequest({
            status: "success",
            data: products,
            error: null,
          });

          // update cache after every download
          products.forEach((product) => {
            saveProductToCache(product);
          });
        })
        .catch((error) => {
          setGetProductsRequest({ status: "error", data: undefined, error });
        })
        .finally(() => {
          window.clearTimeout(loadingTimeoutId);

          if (isCanceled) {
            return;
          }
        });
    }, 300);

    debouncedGetProducts(query);

    return () => {
      isCanceled = true;

      if (loadingTimeoutId) {
        window.clearTimeout(loadingTimeoutId);
      }

      debouncedGetProducts.cancel();
    };
  }, [query]);

  return isOpen ? (
    <SSModal
      mode={"center-small"}
      isOpen
      onRequestClose={() => {
        onClose();
      }}
      headerLine={true}
      searchProps={{
        placeholder: "Search...",
        onChange: (e: any) => {
          setQuery(e.target.value);
        },
      }}
      headerSymbol={"P"}
      noPadding={true}
    >
      {getProductsRequest.status === "loading" && (
        <LoadingContainer isEmpty={!getProductsRequest.data?.length}>
          <ProductsContainer>
            {getProductsRequest.data?.map((product) => (
              <SSBasicRow
                title={product.title}
                onClick={() => {
                  onItemPick(product);
                  onClose();
                }}
                image={product.thumbnail}
              />
            ))}
            <LoadingIndicatorBackdrop />
          </ProductsContainer>
          <LoadingIndicatorWrapper>
            <LoadingIndicator>{loadingIcon}</LoadingIndicator>
          </LoadingIndicatorWrapper>
        </LoadingContainer>
      )}

      {getProductsRequest.status === "success" &&
        (getProductsRequest.data.length > 0 ? (
          getProductsRequest.data.map((product) => (
            <SSBasicRow
              key={product.id}
              title={product.title}
              onClick={() => {
                onItemPick(product);
                onClose();
              }}
              image={product.thumbnail}
            />
          ))
        ) : (
          <NoResults>No results</NoResults>
        ))}

      {getProductsRequest.status === "error" && (
        <NoResults>
          Couldn't fetch data for query "{previousQuery.current}"
        </NoResults>
      )}
    </SSModal>
  ) : null;
}

const ErrorMessage = styled.div`
  word-break: break-all;
  white-space: normal;
  margin-left: 4px;
  ${SSFonts.body}
  color: ${SSColors.black40};
`;

interface LoadingIndicatorProps {
  isEmpty: boolean;
}

const LoadingContainer = styled.div<LoadingIndicatorProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  width: 100%;
  ${({ isEmpty }) =>
    isEmpty &&
    css`
      // Height of 1 item
      min-height: 72px;
    `}
  max-height: 331px;
`;

interface ProductsContainer {
  visibleItemsCount: number;
}

const ProductsContainer = styled.div`
  width: 100%;
  overflow: hidden;
  filter: blur(1px);
`;

const LoadingIndicatorBackdrop = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fefefea1;
  filter: blur(1px);
`;

const LoadingIndicatorWrapper = styled.div`
  position: absolute;
  display: grid;
  place-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingIndicator = styled.div`
  width: 24px;
  height: 24px;
  font-size: 24px;

  > svg {
    animation: ${rotate} 500ms linear infinite;
  }
`;

const NoResults = styled.div`
  display: grid;
  place-items: center;
  height: 48px;
  padding: 12px;

  ${SSFonts.body};
`;

const loadingIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5"
      stroke="currentColor"
      strokeWidth={1.2}
    />
  </svg>
);

import Link from "next/link";
import { Media } from "../Media/Media";
import { ShopifyProduct } from "@/data/shopify";
import { formatPrice } from "@/data/shopify/formatPrice";

const ProductCard = (props: {
  withBackdrop: boolean;
  relatedProductsMode: string;
  product: ShopifyProduct;
}) => {
  const { withBackdrop, relatedProductsMode, product } = props;

  return (
    <div className={`pb-6`} key={product.id}>
      <Link href={"/products/" + product.handle} legacyBehavior>
        <a>
          {product.primaryImage && (
            <div
              className={`relative pb-[70%] ${withBackdrop ? "bg-beige" : ""}`}
            >
              <Media
                media={product.primaryImage}
                layout="fill"
                sizes="(min-width: 1300px) 33.3333vw, (min-width: 740px) 50vw, 100vw"
              />
            </div>
          )}

          <div className={"text-center px-5 pt-5"}>
            <h2 className={"font-mono text-[13px]"}>{product.title}</h2>
            {product.price && (
              <p className={"mt-1 font-sans text-sm font-semibold"}>
                {formatPrice(product.price)}
              </p>
            )}

            {relatedProductsMode !== "disabled" &&
              product.relatedProducts &&
              product.relatedProducts?.length > 1 && (
                <div
                  className={
                    "hidden md:flex flex-row relative flex-wrap gap-1 mt-2 justify-center"
                  }
                >
                  {product.relatedProducts.map((relatedProduct, i) => {
                    if (!relatedProduct.primaryImage) {
                      return null;
                    }

                    const isActive = product.handle === relatedProduct.handle;

                    return (
                      <div
                        className={`w-[40px] h-[40px] flex justify-items-center items-center p-1 ${
                          isActive ? "border border-black-1 rounded-md" : ""
                        }`}
                        key={i}
                      >
                        <Media
                          media={relatedProduct.primaryImage}
                          sizes="80px"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </a>
      </Link>
    </div>
  );
};

export { ProductCard };

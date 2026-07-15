import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { getProductByHandle } from "@/lib/shopify";

const productQuery = (handle: string) => ({
  queryKey: ["shopify", "product", handle],
  queryFn: () => getProductByHandle(handle),
});

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params, context: { queryClient } }) => {
    const product = await queryClient.ensureQueryData(productQuery(params.handle));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Product";
    const description = loaderData?.description?.slice(0, 160) ?? "";
    const imageUrl = loaderData?.images.edges[0]?.node.url;
    return {
      meta: [
        { title: `${title} | Prime Cut` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} | Prime Cut` },
        { property: "og:description", content: description },
        imageUrl ? { property: "og:image", content: imageUrl } : undefined,
      ].filter(Boolean),
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl">Product not found</h1>
      <Button asChild className="mt-6 rounded-full">
        <Link to="/">Back to shop</Link>
      </Button>
    </div>
  ),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(handle));
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants.edges[0]?.node);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const firstImage = product.images.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const formatPrice = (amount: string, currency: string) =>
    `${currency} ${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-4 rounded-full">
        <Link to="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to shop
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-3xl bg-secondary">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText ?? product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit rounded-full mb-4">
            {selectedVariant?.availableForSale ? "In stock" : "Out of stock"}
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground">{product.title}</h1>
          <p className="mt-4 text-3xl font-semibold">
            {selectedVariant
              ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
              : formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode,
                )}
          </p>
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Variant selector */}
          {product.options.length > 0 && (
            <div className="mt-8 space-y-4">
              {product.options.map((option) => (
                <div key={option.name}>
                  <label className="text-sm font-medium mb-2 block">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const variant = product.variants.edges.find((v) =>
                        v.node.selectedOptions.some((o) => o.name === option.name && o.value === value),
                      );
                      const isSelected = selectedVariant?.selectedOptions.some(
                        (o) => o.name === option.name && o.value === value,
                      );
                      return (
                        <Button
                          key={value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                          disabled={!variant?.node.availableForSale}
                          onClick={() => variant && setSelectedVariant(variant.node)}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

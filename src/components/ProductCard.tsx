import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const node = product.node;
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = firstVariant?.price ?? node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;

    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
  };

  return (
    <Card className="group overflow-hidden border-border bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <Link to="/product/$handle" params={{ handle: node.handle }}>
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText ?? node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              لا توجد صورة
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to="/product/$handle" params={{ handle: node.handle }}>
          <h3 className="font-serif text-xl leading-tight group-hover:text-primary transition-colors">
            {node.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {node.description || "قطعة فاخرة الجودة"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold">
            {price.currencyCode === 'EUR' ? 'MAD' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            className="rounded-full"
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant?.availableForSale}
          >
            <ShoppingBag className="h-4 w-4 ml-2" />
            أضف
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

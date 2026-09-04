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
    <Card className="group overflow-hidden border-border bg-card rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
              لا توجد صورة
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-2 sm:p-4">
        <Link to="/product/$handle" params={{ handle: node.handle }}>
          <h3 className="font-serif text-xs sm:text-base lg:text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {node.title}
          </h3>
        </Link>
        <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {node.description || "قطعة فاخرة الجودة"}
        </p>
        <div className="flex items-center justify-between gap-1 sm:gap-3 mt-1 sm:mt-0">
          <span className="text-xs sm:text-lg font-semibold">
            {price.currencyCode === 'EUR' ? 'MAD' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            className="rounded-full h-7 w-7 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant?.availableForSale}
            aria-label="أضف إلى السلة"
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:ml-2" />
            <span className="hidden sm:inline">أضف</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

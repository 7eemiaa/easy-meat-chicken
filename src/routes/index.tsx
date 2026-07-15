import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Truck, Leaf, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify";
import heroImage from "@/assets/hero-meat.jpg";

const productsQuery = (query?: string) => ({
  queryKey: ["shopify", "products", query ?? "all"],
  queryFn: () => getProducts(50, query),
});

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(productsQuery());
  },
  head: () => ({
    meta: [
      { title: "Prime Cut | Premium Meat & Chicken Delivery" },
      { name: "description", content: "Shop farm-fresh premium meat and chicken delivered to your door." },
      { property: "og:title", content: "Prime Cut | Premium Meat & Chicken Delivery" },
      { property: "og:description", content: "Shop farm-fresh premium meat and chicken delivered to your door." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery());

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Premium meat and chicken selection"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-fat/20 px-3 py-1 text-sm font-medium text-foreground mb-6">
              Farm fresh, delivered fast
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground">
              Premium Meat & Chicken, Delivered
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
              Hand-selected cuts from trusted farms. Order in seconds, cook with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                <Link to="/" hash="shop">
                  Shop Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Farm Fresh</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sourced from trusted local farms with ethical practices.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Chilled packaging keeps everything perfect from farm to door.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Hand-selected cuts, ready to cook to perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground">Our Selection</h2>
            <p className="mt-2 text-muted-foreground">Click any product to view details and add to cart.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
            <h3 className="font-serif text-2xl text-foreground">No products found</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Your Shopify store is connected, but there are no meat or chicken products yet.
              Tell me what you'd like to sell and I'll add them for you.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/" hash="shop">Refresh</Link>
            </Button>
          </div>
        ) : (
          (() => {
            const cookedMeals = products.filter((p) => p.node.productType === "Cooked Meals");
            const freshMeat = products.filter((p) => p.node.productType !== "Cooked Meals");
            return (
              <div className="flex flex-col gap-16">
                {freshMeat.length > 0 && (
                  <div>
                    <h3 className="font-serif text-3xl text-foreground mb-6">Fresh Meat & Chicken</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {freshMeat.map((product) => (
                        <ProductCard key={product.node.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
                {cookedMeals.length > 0 && (
                  <div>
                    <h3 className="font-serif text-3xl text-foreground mb-6">Cooked Meals</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cookedMeals.map((product) => (
                        <ProductCard key={product.node.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </section>
    </div>
  );
}

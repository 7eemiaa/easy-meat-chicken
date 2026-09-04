import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Truck, Beef, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify";
import heroImage from "@/assets/hero-elgzar.jpg";

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
      { title: "Elgzar | الگزار — لحوم حمراء حلال، بقري وخروفي" },
      { name: "description", content: "Boucherie Elgzar : bœuf et agneau halal, coupés à la main et livrés. لحوم حمراء حلال طازجة، وقسم دجاجي للدواجن." },
      { property: "og:title", content: "Elgzar | الگزار — لحوم حمراء حلال" },
      { property: "og:description", content: "Bœuf & agneau halal livrés chez vous. لحوم حمراء حلال طازجة تُوصَّل إليك." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery());

  const redMeat = products.filter(
    (p) => p.node.productType === "Beef" || p.node.productType === "Lamb",
  );
  const poultry = products.filter((p) => p.node.productType === "Chicken");
  const cookedMeals = products.filter((p) => p.node.productType === "Cooked Meals");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="قطع لحوم حمراء فاخرة — bœuf et agneau"
            className="w-full h-full object-cover"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/85 to-background/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-foreground mb-6">
              100% حلال · Sans porc
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground">
              الگزار — بوشري اللحوم الحمراء
            </h1>
            <p className="mt-4 text-lg uppercase tracking-[0.25em] text-primary">
              Boucherie Elgzar
            </p>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
              بقري وخروفي فقط: قطع مختارة يقطعها الجزار يدوياً وتُوصَّل طازجة إلى بابك.
              <br />
              Bœuf et agneau uniquement, coupés à la main et livrés frais.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                <Link to="/" hash="viande">
                  اللحوم الحمراء · Viande
                  <ChevronRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base"
              >
                <Link to="/djaji">دجاجي · Volaille</Link>
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
                <Beef className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">بقري وخروفي حلال · Halal</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  لحوم حمراء فقط، بدون خنزير أبداً. Jamais de porc.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">توصيل مبرَّد · Livraison</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  تغليف مبرَّد يحفظ الطزاجة من المحل إلى بابك.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">قطع الجزار · Coupe artisanale</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  يقطعها الجزار يدوياً حسب الطلب، جاهزة للطبخ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red meat — Elgzar */}
      <section id="viande" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Elgzar · الگزار</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mt-2">
            اللحوم الحمراء — Bœuf & Agneau
          </h2>
          <p className="mt-2 text-muted-foreground">
            اضغط على أي منتج لعرض التفاصيل وإضافته إلى السلة.
          </p>
        </div>

        {redMeat.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
            <h3 className="font-serif text-2xl text-foreground">لا توجد منتجات</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              أخبرني بما تريد بيعه من اللحوم الحمراء وسأضيفه لك.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {redMeat.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Djaji — poultry sub-brand */}
      {poultry.length > 0 && (
        <section id="djaji" className="border-t border-border bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.25em] text-primary">
                Djaji · قسم من الگزار
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground mt-2">
                دجاجي — Volaille
              </h2>
              <p className="mt-2 text-muted-foreground">
                علامتنا الخاصة بالدواجن الطازجة، داخل الگزار.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {poultry.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cooked meals */}
      {cookedMeals.length > 0 && (
        <section id="cuisine" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground">
              وجبات مطهوة — Cuisine
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {cookedMeals.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

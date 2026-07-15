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
      { title: "دجاجي | توصيل اللحوم والدجاج الفاخر" },
      { name: "description", content: "تسوّق اللحوم والدجاج الطازج من المزرعة يُوصَّل إلى باب منزلك." },
      { property: "og:title", content: "دجاجي | توصيل اللحوم والدجاج الفاخر" },
      { property: "og:description", content: "تسوّق اللحوم والدجاج الطازج من المزرعة يُوصَّل إلى باب منزلك." },
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
            alt="تشكيلة لحوم ودجاج فاخرة"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-fat/20 px-3 py-1 text-sm font-medium text-foreground mb-6">
              طازج من المزرعة، توصيل سريع
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground">
              لحوم ودجاج فاخر، يُوصَّل إليك
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
              قطع مختارة بعناية من مزارع موثوقة. اطلب في ثوانٍ واطبخ بثقة.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                <Link to="/" hash="shop">
                  تسوّق الآن
                  <ChevronRight className="mr-2 h-4 w-4 rtl:rotate-180" />
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
                <h3 className="font-semibold">طازج من المزرعة</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  من مزارع محلية موثوقة ذات ممارسات أخلاقية.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">توصيل سريع</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  تغليف مبرَّد يحافظ على كل شيء طازجاً من المزرعة إلى بابك.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">جودة فاخرة</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  قطع منتقاة يدوياً وجاهزة للطبخ إلى الكمال.
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
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground">تشكيلتنا</h2>
            <p className="mt-2 text-muted-foreground">اضغط على أي منتج لعرض التفاصيل وإضافته إلى السلة.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
            <h3 className="font-serif text-2xl text-foreground">لا توجد منتجات</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              متجرك متصل ولكن لا توجد منتجات بعد. أخبرني بما تريد بيعه وسأضيفه لك.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/" hash="shop">تحديث</Link>
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
                    <h3 className="font-serif text-3xl text-foreground mb-6">اللحوم والدجاج الطازج</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {freshMeat.map((product) => (
                        <ProductCard key={product.node.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
                {cookedMeals.length > 0 && (
                  <div>
                    <h3 className="font-serif text-3xl text-foreground mb-6">وجبات مطهوة</h3>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify";

const productsQuery = () => ({
  queryKey: ["shopify", "products", "all"],
  queryFn: () => getProducts(50),
});

export const Route = createFileRoute("/djaji")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(productsQuery());
  },
  head: () => ({
    meta: [
      { title: "Djaji | دجاجي — دجاج طازج حلال" },
      {
        name: "description",
        content:
          "Djaji : volaille halal fraîche, poulet entier, blancs et ailes. دجاجي — دجاج طازج حلال يُوصَّل إليك.",
      },
      { property: "og:title", content: "Djaji | دجاجي — Volaille halal" },
      {
        property: "og:description",
        content: "Poulet halal frais livré chez vous. دجاج طازج حلال من الگزار.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DjajiPage,
});

function DjajiPage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const poultry = products.filter((p) => p.node.productType === "Chicken");

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">
            Djaji · قسم من الگزار
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-foreground mt-3">
            دجاجي — Volaille
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            دجاج طازج حلال: كامل، صدور، وأجنحة.
            <br />
            Poulet halal frais : entier, blancs et ailes.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12">
              <Link to="/">
                الگزار · اللحوم الحمراء
                <ChevronRight className="mr-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {poultry.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center">
            <h2 className="font-serif text-2xl text-foreground">لا توجد منتجات</h2>
            <p className="mt-2 text-muted-foreground">
              أخبرني بما تريد بيعه من الدواجن وسأضيفه لك.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {poultry.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getAllProductSlugs } from "@/features/products/data/products";

type ProductsAliasProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductsAliasPage({ params }: ProductsAliasProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}


import { redirect } from "next/navigation";

type ProductsAliasProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductsAliasPage({ params }: ProductsAliasProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}


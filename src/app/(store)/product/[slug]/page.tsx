import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCachedProductBySlug,
  getCachedRelatedProducts,
  getAllProductSlugs,
} from "@/features/products/data/products";
import ProductDetailView from "@/components/store/product/product-detail-view";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Nivaroa",
    };
  }

  const image =
    product.images?.[0] || product.image_path || "/og-image.jpg";

  return {
    title: `${product.name} | Nivaroa`,
    description:
      product.product_description?.slice(0, 160) ||
      `Shop the premium ${product.name} at Nivaroa.`,
    openGraph: {
      title: `${product.name} | Nivaroa`,
      description:
        product.product_description?.slice(0, 160) ||
        `Shop ${product.name} online at Nivaroa.`,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getCachedRelatedProducts(
    product.category_id,
    product.id,
    4
  );

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}


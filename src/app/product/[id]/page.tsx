import { fetchProductById } from "@/lib/api";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import ProductClient from "./productClient";



export async function generateStaticParams() {
    const res = await fetch("https://dummyjson.com/products?limit=10");
    const { products } = await res.json();

    return products.map((product: Product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage(props: any) {
    const { id } = props.params as { id: string };
    const product = await fetchProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductClient initialProduct={product} />;
}

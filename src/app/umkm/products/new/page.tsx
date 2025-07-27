import { ProductForm } from "@/components/umkm/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Produk Baru</CardTitle>
        <CardDescription>Isi detail produk yang ingin Anda jual.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
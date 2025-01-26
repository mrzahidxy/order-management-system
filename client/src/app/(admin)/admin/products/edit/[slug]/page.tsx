import { ProductCreateUpdate } from "../../add/product-create-update.component";

function EditProductPage({ params }: any) {

  return (
    <div>
      <ProductCreateUpdate id={params.slug} />
    </div>
  );
}

export default EditProductPage;

import {  PromotionCreateUpdate } from "../../add/promotion-create-update.component";

function EditProductPage({ params }: any) {

  return (
    <div>
      <PromotionCreateUpdate id={params.slug} />
    </div>
  );
}

export default EditProductPage;

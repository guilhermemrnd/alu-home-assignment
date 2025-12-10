type Props = PropsFrom<Product>;

export type ProductFieldName = keyof PropsFrom<Product>;
export type Mapping = Record<ProductFieldName, string>;

export class Product {
  purchase_order: string = "";
  product_name: string = "";
  country_of_origin: string = "";
  supplier: string = "";
  supplier_email: string = "";
  certifications: string = "";
  status_of_certifications: string = "";
  material_composition: string = "";
  season: string = "";
  group_id: string = "";

  constructor(data: Partial<Props> = {}) {
    Object.assign(this, data);
  }

  clone(): Product {
    return new Product(this);
  }

  toObject(): Props {
    return { ...this };
  }

  updateField(field: keyof this, value: string): Product {
    const newProduct = this.clone();
    (newProduct as any)[field] = value;
    return newProduct;
  }
}

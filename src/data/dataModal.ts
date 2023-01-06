export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export type OrderType = { count: string; price: string };
export interface ICartOrder extends IProduct {
    order: OrderType;
}

export interface IData {
    productList: IProduct[];
    total: number;
    skip: number;
    limit: number;
}

export interface IOrder {
    id: number;
    count: number;
}

export interface ICart {
    orderList: IOrder;
}

export type ProductKeyType = keyof IProduct;
export type ProductValueType = Array<IProduct[ProductKeyType]>;

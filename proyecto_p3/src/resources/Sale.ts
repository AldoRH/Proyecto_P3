import { Product } from "./Product";
import { Service } from "./Service";

export interface Sale {
    id: number,
    products: Product[],
    services: Service[],
}


import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem {
    menuId:string;
    quantity:number;
}
export type CartState = {
    cart:CartItem[];
    addToCart:(item:MenuItem) => Promise<void>;
    getCart: () => Promise<void>;
    clearCart: () => Promise<void>;
    removeFromTheCart: (menuId:string) => Promise<void>;
    incrementQuantity: (menuId:string) => Promise<void>;
    decrementQuantity: (menuId:string) => Promise<void>;
}
import Image from "next/image";
import { WishlistItem } from "@/types/Items";

interface WishlistItemProps {
  item: WishlistItem;
  removeItem: (id: string) => Promise<void>;
  addToCart: (id: string, itemId:string) => Promise<void>;
}

export default function WishlistItemComponent({ item, removeItem, addToCart }: WishlistItemProps) {
  return (
    <div className="border-b p-4 flex flex-col md:flex-row items-start gap-4">
      <div className="w-24 h-24 relative text-gray-800">
        <Image
          src={item.imageUrl || "/placeholder-product.png"}
          alt={item.name}
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
        {/* toLocaleString convierte el numero con separador de miles */}
        <p className="text-2xl font-semibold mt-1 text-gray-800">$ {item.price.toLocaleString()}</p> 
        
        <div className="flex mt-4 space-x-3">
          <button 
            onClick={() => removeItem(item.itemId)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Eliminar
          </button>
          <button 
          // addtoCart recibe el productid y el itemid para borrarlo
            onClick={() => addToCart(item.id, item.itemId)} 
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
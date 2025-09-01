import React from 'react';
import CartItem from './CartItem';
import Title from '../Utils/Title';

const CartItemList = ({ cartItems, updateQuantity, removeItem }) => (
  <div className="w-full max-w-[625px] px-5">
    <div className="text-2xl mb-3 truncate">
      <Title text1="YOUR" text2="CART" />
    </div>
    <div className="h-[500px] overflow-y-auto pr-2">
      {cartItems.map(item => (
        <CartItem
          key={item.id}
          item={item}
          updateQuantity={updateQuantity}
          removeItem={removeItem} 
        />
      ))}
    </div>
  </div>
);

export default CartItemList;
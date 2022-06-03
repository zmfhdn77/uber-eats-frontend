import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, options: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  options,
  orderStarted = false,
  isSelected = false,
  addItemToOrder,
  removeFromOrder,
  addOptionToItem,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 pt-3 pb-8 border transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800 "
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium">
          {name}
          {orderStarted && (
            <button onClick={onClick}>{!isSelected ? "Add" : "Remove"}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options?.length !== 0 && (
        <div>
          <h5 className="my-3 fonte-medium">Dish Options:</h5>
          {options?.map((option, index) => (
            <span
              onClick={() =>
                addOptionToItem
                  ? addOptionToItem(id, {
                      name: option.name,
                      extra: option.extra,
                    })
                  : null
              }
              className="flex border items-center"
              key={index}
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">${option.extra}</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import React from "react";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImg})` }}
        className="bg-cover bg-center mb-3 py-28"
      ></div>
      <h3 className="text-xl font-medium">{name}</h3>
      <span className="border-t mt-3 py-2 opacity-50 border-gray-200">
        {categoryName}
      </span>
    </div>
  );
};

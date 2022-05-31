import React from "react";

interface ICategoryProps {
  coverImg?: string;
  name: string;
}

export const Category: React.FC<ICategoryProps> = ({ coverImg, name }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div
        className=" w-14 h-14 bg-cover group-hover:bg-gray-200 rounded-full"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium">{name}</span>
    </div>
  );
};

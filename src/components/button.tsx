import React, { lazy } from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => {
  return (
    <button
      className={`mt-3 text-lg font-medium focus:outline-none text-white py-4 transition-colors ${
        canClick
          ? "bg-lime-500 hover:bg-lime-800 "
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};

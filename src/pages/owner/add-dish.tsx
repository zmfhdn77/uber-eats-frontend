import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormProps>({ mode: "onChange" });
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: restaurantId ? +restaurantId : 0,
          },
        },
      },
    ],
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const options = optionsNumber.map((theId) => ({
      name: rest[`${theId}-OptionName`],
      extra: +rest[`${theId}-OptionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          options,
          restaurantId: restaurantId ? +restaurantId : 0,
        },
      },
    });
    navigate(-1);
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteOptionClick = (idToDelete: number) => {
    console.log("delete");
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-OptionName`, "");
    setValue(`${idToDelete}-OptionExtra`, "");
  };

  return (
    <div className="container flex flex-col  items-center mt-52">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3z">Add Dish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("name", { required: "Name is required." })}
          className="input"
          type="text"
          placeholder="Name"
        />
        <input
          {...register("price", { required: "Price is required." })}
          className="input"
          type="number"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", { required: "Description is required." })}
          className="input"
          type="text"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-OptionName`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`${id}-OptionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 "
                  type="number"
                  placeholder="Option Extra Price"
                />
                <span
                  onClick={() => onDeleteOptionClick(id)}
                  className="cursor-pointer py-3 px-4 text-white bg-red-500 ml-3 mt-5"
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Dish"
        ></Button>
      </form>
    </div>
  );
};

import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}
export const AddRestaurant = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IFormProps>({ mode: "onChange" });
  const onSubmit = () => {
    console.log(getValues());
  };
  const [createRestaurantMutation, { data, loading }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);
  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurants | Uber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="input"
          placeholder="Name"
          {...register("name", { required: "Name is required." })}
        />
        <input
          type="text"
          className="input"
          placeholder="Address"
          {...register("address", { required: "Address is required." })}
        />
        <input
          type="text"
          className="input"
          placeholder="Category"
          {...register("categoryName", {
            required: "Category Name is required.",
          })}
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};

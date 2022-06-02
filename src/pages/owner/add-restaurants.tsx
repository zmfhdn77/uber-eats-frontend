import { gql, useApolloClient, useMutation } from "@apollo/client";
import { url } from "inspector";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}
export const AddRestaurant = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                  __proto__: Object,
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate("/");
      setUploading(false);
    }
  };

  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IFormProps>({ mode: "onChange" });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });

  return (
    <div className="container flex flex-col  items-center">
      <Helmet>
        <title>Add Restaurants | Uber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3z">Add Restaurant</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
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
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data?.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};

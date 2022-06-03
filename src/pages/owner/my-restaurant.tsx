import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useMe } from "../../hooks/useMe";
import {
  createPayment,
  createPaymentVariables,
} from "../../__generated__/createPayment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;

export const MyRestaurant = () => {
  const { id } = useParams<{ id: string }>();
  const { data: userData } = useMe();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: id ? +id : 0 } } },
  );
  const onCompleted = (data: createPayment) => {
    if (data.createPayment.ok) {
      alert("Your restaurant is being promoted!!");
    }
  };
  const [createPaymentMutation, { loading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT_MUTATION, { onCompleted });

  // TODO: Need to solve CORS issue
  const triggerPaddle = () => {
    //@ts-ignore
    window.Paddle.Setup({ vendor: 149070 });
    //@ts-ignore
    window.Paddle.Checkout.open({
      product: 774489,
      email: userData?.me.email,
      successCallback: (data: any) => {
        createPaymentMutation({
          variables: {
            input: {
              transactionId: data.checkout.id,
              restaurantId: id ? +id : 0,
            },
          },
        });
      },
    });
  };

  return (
    <div>
      <Helmet>
        <title>My Restaurant Detail | Uber Eats</title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <span
          onClick={triggerPaddle}
          className="cursor-pointer mr-8 text-white bg-lime-700 py-3 px-10"
        >
          Buy Promotion &rarr;
        </span>
      </div>
      <div className="mt-10">
        {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
          <h4 className="text-xl mb-5">Please upload a dish!</h4>
        ) : (
          <div className="mt-10 grid md:grid-cols-3 mb-8 gap-x-5 gap-y-10">
            {data?.myRestaurant.restaurant?.menu?.map((menu) => (
              <Dish
                key={menu.id}
                name={menu.name}
                description={menu.description}
                price={menu.price}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-20">
        <h4 className="text-center text-2xl font-medium">Sales</h4>
        <div className="max-s-m"></div>
      </div>
    </div>
  );
};

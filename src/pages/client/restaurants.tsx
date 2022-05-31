import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
        count: 3,
      },
    },
  });
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const navigate = useNavigate();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({ pathname: "/search", search: `term=${searchTerm}` });
  };

  return (
    <div>
      <Helmet>
        <title>Restaurants | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-4xl mx-auto mt-8">
          <div className="flex justify-around max-w-screen-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Link
                key={`link:${category.id}`}
                to={`/category/${category.slug}`}
              >
                <Category
                  key={`category:${category.id}`}
                  coverImg={category.coverImg ? category.coverImg : ""}
                  name={category.name}
                />
              </Link>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-3 mb-8 gap-x-5 gap-y-10">
            {data?.restaurants.restaurants?.map((restaurant) => (
              <Restaurant
                key={`restaurant:${restaurant.id}`}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md mx-auto items-center mt-10">
            {page !== 1 ? (
              <button
                onClick={onPrevPageClick}
                className="font-medium text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="mx-5">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="font-medium text-2xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

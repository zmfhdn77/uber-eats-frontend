import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface ISearchState {
  searchTerm: string;
}
export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }

    queryReadyToStart({
      variables: {
        input: {
          page: page,
          count: 3,
          query,
        },
      },
    });
  }, [location, navigate]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      {!loading && called && data && (
        <div className="max-w-screen-4xl mx-auto mt-8">
          <div className="mt-10 grid md:grid-cols-3 mb-8 gap-x-5 gap-y-10">
            {data.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 text-center max-w-md mx-auto items-center mt-10">
        {page !== 1 ? (
          <button onClick={onPrevPageClick} className="font-medium text-2xl">
            &larr;
          </button>
        ) : (
          <div></div>
        )}
        <span className="mx-5">
          Page {page} of {data?.searchRestaurant.totalPages}
        </span>
        {page !== data?.searchRestaurant.totalPages ? (
          <button onClick={onNextPageClick} className="font-medium text-2xl">
            &rarr;
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

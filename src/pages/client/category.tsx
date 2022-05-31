import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;
export const Category = () => {
  const param = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: page,
          count: 3,
          slug: param.slug || "",
        },
      },
    },
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  console.log(data);

  return (
    <div>
      <Helmet>
        <title>Category | Uber Eats</title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-4xl mx-auto mt-8">
          <div className="mt-10 grid md:grid-cols-3 mb-8 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant) => (
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
          Page {page} of {data?.category.totalPages}
        </span>
        {page !== data?.category.totalPages ? (
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

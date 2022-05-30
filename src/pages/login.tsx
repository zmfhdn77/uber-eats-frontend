import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import uberLogo from "../images/logo.svg";
import { Helmet } from "react-helmet-async";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, error, token },
    } = data;
    if (ok && token) {
      authToken(token);
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    variables: {
      loginInput: {
        email: watch("email"),
        password: watch("password"),
      },
    },
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      loginMutation();
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={uberLogo} className="w-56 mb-5" />
        <h4 className="text-left font-medium w-full text-3xl">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 mt-5 mb-5 w-full"
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="Please enter email address" />
          )}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 5,
            })}
            placeholder="Password"
            className="input"
            type="password"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 5 chars." />
          )}
          <Button canClick={isValid} loading={loading} actionText="Log In" />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to uber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

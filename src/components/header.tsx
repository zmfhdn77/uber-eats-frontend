import React from "react";
import { useMe } from "../hooks/useMe";
import uberLogo from "../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 py-7 px-3 text-center text-xs">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-4xl  mx-auto flex justify-between items-center">
          <Link to={"/"}>
            <img src={uberLogo} className="w-24" alt="Uber Eats" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
              <span className="px-3">{data?.me.email}</span>
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

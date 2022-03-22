import { Flex, Link } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Wrapper } from "./Wrapper";

import {
  AccessTokenPayload,
  fetchAccessToken,
  setAccessToken
} from "../utils/token";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  useEffect(() => {
    console.log("in effect");
    async function getToken() {
      const res = await fetchAccessToken();
      const data: AccessTokenPayload = await res.json();
      if (data.ok) {
        setAccessToken(data.accessToken);
      }
      refetch();
    }
    getToken();
  }, []);
  const { data, loading, error, refetch } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body =
    data && data.me && !loading ? (
      <div>you are logged in as: {data.me.email}</div>
    ) : (
      <div>not logged in</div>
    );

  const logoutHandler = async () => {
    await logout(); // clear refresh token
    setAccessToken(""); // clear access token
    await client.resetStore(); // clear cache
  };
  if (error) {
    console.log(!!error);
  }

  return (
    <Wrapper variant="small">
      <button onClick={() => console.log(data)}>click</button>
      <Flex gap={4} p={4}>
        {!(data && data.me && !loading) ? (
          <>
            <Link as={NavLink} to="/login">
              Login
            </Link>

            <Link as={NavLink} to="/register">
              Register
            </Link>
          </>
        ) : (
          <Link onClick={logoutHandler}>Logout</Link>
        )}

        <Link as={NavLink} to="/">
          Home
        </Link>
        <Link as={NavLink} to="/me">
          me
        </Link>
        {body}
      </Flex>
    </Wrapper>
  );
};

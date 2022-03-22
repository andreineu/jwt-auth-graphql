import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";
import { TokenRefreshLink } from "apollo-link-token-refresh";

import {
  fetchAccessToken,
  getAccessToken,
  isTokenValid,
  setAccessToken
} from "../utils/token";

const cache = new InMemoryCache();

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((_oper) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `bearer ${accessToken}`
              }
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

export const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: isTokenValid,
      fetchAccessToken: fetchAccessToken,
      handleFetch: (token) => {
        setAccessToken(token);
      },
      handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      }
    }),
    onError(({ graphQLErrors, networkError }) => {
      // console.log("graphQLErrors: ", graphQLErrors);
      // console.log("networkError: ", networkError);
    }),
    requestLink,
    new HttpLink({
      uri: "http://localhost:4000/graphql",
      credentials: "include"
    })
  ]),
  // connectToDevTools: true,
  cache
});

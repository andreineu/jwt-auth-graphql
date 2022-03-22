import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./app/App";
import { client } from "./app/client";

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

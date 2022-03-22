import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Wrapper } from "../components/Wrapper";
import { useMeQuery } from "../generated/graphql";

interface MeProps {}

export const Me: React.FC<MeProps> = ({}) => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "network-only"
  });

  if (loading) {
    return (
      <Wrapper>
        <h1>loading...</h1>
      </Wrapper>
    );
  }
  if (error) {
    console.error(error);
    return (
      <Wrapper>
        <h1>open console to view error</h1>
      </Wrapper>
    );
  }
  if (!data) {
    return (
      <Wrapper>
        <h1>no data</h1>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Box p={4}>
        <Text fontSize={20}>{JSON.stringify(data)}</Text>
      </Box>
      <Box p={4}>
        <Text fontSize={20}>email: {data.me?.email}</Text>
      </Box>
    </Wrapper>
  );
};

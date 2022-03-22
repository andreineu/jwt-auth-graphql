import { UnorderedList, ListItem, Box } from "@chakra-ui/react";
import React from "react";
import { Wrapper } from "../components/Wrapper";
import { useUsersQuery } from "../generated/graphql";

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const { data, loading } = useUsersQuery();
  if (loading) return <h1>Loading...</h1>;
  else if (!data) return <h1>Error fetching data</h1>;
  return (
    <Wrapper>
      <Box>
        users:
        <UnorderedList>
          {data.users.map((user) => (
            <ListItem key={user.id}>{user.email}</ListItem>
          ))}

          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </UnorderedList>
      </Box>
    </Wrapper>
  );
};

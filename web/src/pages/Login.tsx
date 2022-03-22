import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { setAccessToken } from "../utils/token";

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (store, { data }) => {
              if (!data) {
                return null;
              }
              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data.login.user!
                }
              });
            }
          });

          console.log(response);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.accessToken) {
            setAccessToken(response.data.login.accessToken);
            // console.log("logged in");
            navigate("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" placeholder="email" label="Email" />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={2}></Flex>
            <Button mt={4} type="submit" isLoading={isSubmitting} color="teal">
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

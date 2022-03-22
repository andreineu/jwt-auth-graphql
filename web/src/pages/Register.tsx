import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: values
          });
          console.log("response", response);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
            <Button mt={4} type="submit" isLoading={isSubmitting} color="teal">
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export const validateRegister = (email: string, password: string) => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email"
      }
    ];
  }

  // if (username.length <= 2) {
  //   return [
  //     {
  //       field: "username",
  //       message: "length must be greater than 2",
  //     },
  //   ];
  // }

  // if (username.includes("@")) {
  //   return [
  //     {
  //       field: "username",
  //       message: "cannot include an @",
  //     },
  //   ];
  // }

  if (password.length <= 4) {
    return [
      {
        field: "password",
        message: "length must be greater than 4"
      }
    ];
  }
  return null;
};

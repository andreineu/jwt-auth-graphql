import { Box } from "@chakra-ui/react";

import { NavBar } from "../components/NavBar";
import { AppRoutes } from "./Routes";

function App() {
  return (
    <Box>
      <NavBar />
      <AppRoutes />
    </Box>
  );
}

export default App;

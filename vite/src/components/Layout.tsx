import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  return (
    <Flex minH={"100vh"} maxW={768} mx={"auto"} flexDir={"column"}>
      <Header />
      <Flex bgColor={"green.100"} flexGrow={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default Layout;

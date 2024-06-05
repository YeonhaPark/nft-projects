import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ethers } from "ethers";

const Layout: FC = () => {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [mintContract, setMintContract] = useState<ethers.Contract | null>(
    null
  );
  return (
    <Flex minH={"100vh"} maxW={768} mx={"auto"} flexDir={"column"}>
      <Header
        signer={signer}
        setSigner={setSigner}
        setMintContract={setMintContract}
      />
      <Flex flexGrow={1}>
        <Outlet context={{ mintContract, signer }} />
      </Flex>
    </Flex>
  );
};

export default Layout;

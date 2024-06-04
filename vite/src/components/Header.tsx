import { Button, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

const Header: FC = () => {
  const navigate = useNavigate();
  return (
    <Flex bgColor={"blue.100"} h={24} justifyContent={"space-between"}>
      <Flex
        bgColor="red.100"
        w={40}
        fontSize={16}
        fontWeight={"semibold"}
        alignItems={"center"}
      >
        <Image src="/images/logo.svg" alt="logo" w={16} />
        슬라임 월드
      </Flex>
      <Flex alignItems={"center"} gap={4}>
        <Button
          variant="link"
          w={20}
          colorScheme="green"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        <Button
          variant="link"
          w={20}
          colorScheme="green"
          onClick={() => navigate("/mint-nft")}
        >
          Minting
        </Button>
        <Button
          variant="link"
          w={20}
          colorScheme="green"
          onClick={() => navigate("/my-nft")}
        >
          My NFT
        </Button>
        <Button
          variant="link"
          w={20}
          colorScheme="green"
          onClick={() => navigate("/sale-nft")}
        >
          Market
        </Button>
      </Flex>
      <Flex
        w={40}
        bgColor={"red.100"}
        justifyContent={"end"}
        alignItems={"center"}
      >
        <Button>Metamask</Button>
      </Flex>
    </Flex>
  );
};

export default Header;

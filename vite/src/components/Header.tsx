import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { ethers, Contract } from "ethers";
import mintAbi from "../abis/mintAbi.json";
import saleAbi from "../abis/saleAbi.json";
import {
  mintContractAddress,
  saleContractAddress,
} from "../abis/contractAddress";
interface HeaderProps {
  signer: ethers.JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<ethers.JsonRpcSigner | null>>;
  setMintContract: Dispatch<SetStateAction<ethers.Contract | null>>;
  setSaleContract: Dispatch<SetStateAction<ethers.Contract | null>>;
}
const Header: FC<HeaderProps> = ({
  signer,
  setSigner,
  setMintContract,
  setSaleContract,
}) => {
  const navigate = useNavigate();

  const handleMetamaskClick = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const ret = await provider.getSigner();
      console.log({ ret });
      setSigner(ret);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!signer) {
      setMintContract(null);
    } else {
      setMintContract(new Contract(mintContractAddress, mintAbi, signer));
      setSaleContract(new Contract(saleContractAddress, saleAbi, signer));
    }
  }, [signer, setMintContract, setSaleContract]);
  return (
    <Flex h={24} justifyContent={"space-between"}>
      <Flex
        flexDir={["column", "column", "row"]}
        w={40}
        fontSize={[16, 16, 20]}
        fontWeight={"semibold"}
        alignItems={"center"}
      >
        <Image src="/images/logo.svg" alt="logo" w={16} />
        슬라임 월드
      </Flex>
      <Flex alignItems={"center"} gap={[1, 1, 4]}>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/")}
          size={["xs", "xs", "md"]}
        >
          Home
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/mint-nft")}
          size={["xs", "xs", "md"]}
        >
          Minting
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/my-nft")}
          size={["xs", "xs", "md"]}
        >
          My NFT
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/sale-nft")}
          size={["xs", "xs", "md"]}
        >
          Market
        </Button>
      </Flex>
      <Flex w={40} justifyContent={"end"} alignItems={"center"}>
        {signer ? (
          <Menu>
            <MenuButton
              as={Button}
              size={["xs", "xs", "md"]}
              rightIcon={<FiChevronDown />}
            >
              {`${signer.address.substring(0, 5)}...${signer.address.substring(
                signer.address.length - 4
              )}`}
            </MenuButton>
            <MenuList minW={[20, 20, 40]}>
              <MenuItem fontSize={[8, 8, 12]} onClick={() => setSigner(null)}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button onClick={handleMetamaskClick} size={["xs", "xs", "md"]}>
            Metamask
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;

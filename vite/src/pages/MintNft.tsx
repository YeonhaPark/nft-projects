import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MintModal from "../components/MintModal";

const MintNft: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nftMetadata, setNftMetadata] = useState<NftMetadata>({
    name: "",
    description: "",
    image: "",
    attributes: [
      {
        trait_type: "",
        value: "",
      },
    ],
  });
  const { mintContract, signer } = useOutletContext<OutletContext>();
  const mintNft = async () => {
    try {
      setIsLoading(true);
      await mintContract.mintNft();
      const totalSupply = await mintContract.totalSupply();
      const tokenURI = await mintContract.tokenURI(totalSupply);
      const axiosResponse = await axios.get<NftMetadata>(tokenURI);
      setNftMetadata(axiosResponse.data);
      onOpen();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => console.log(nftMetadata), [nftMetadata]);

  return (
    <>
      <Flex
        w="100%"
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
        gap={4}
      >
        {!signer && <Text>Login Required</Text>}
        <Button
          onClick={mintNft}
          isDisabled={!signer}
          isLoading={isLoading}
          loadingText="Loading"
        >
          MintNft
        </Button>
      </Flex>
      <MintModal onClose={onClose} isOpen={isOpen} nftMetadata={nftMetadata} />
    </>
  );
};

export default MintNft;

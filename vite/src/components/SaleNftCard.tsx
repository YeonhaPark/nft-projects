import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { Contract, JsonRpcSigner, formatEther } from "ethers";
import axios from "axios";

interface SaleNftCardProps {
  mintContract: Contract;
  saleContract: Contract;
  tokenId: number;
  signer: JsonRpcSigner;
  setTokenIds: Dispatch<SetStateAction<number[]>>;
}
const SaleNftCard: FC<SaleNftCardProps> = ({
  saleContract,
  mintContract,
  tokenId,
  signer,
  setTokenIds,
}) => {
  const [owner, setOwner] = useState<string>("");
  const [metadata, setMetadata] = useState<SaleNftMetadata>({
    price: 0n,
    name: "",
    description: "",
    image: "",
    attributes: [{ trait_type: "", value: "" }],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const purchaseNft = async () => {
    try {
      setIsLoading(true);
      await saleContract.purchaseNft(tokenId, {
        value: metadata.price,
      });

      setTokenIds((prev) =>
        prev.filter((v) => {
          if (v !== tokenId) {
            return v;
          }
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  const getNftMetadata = async () => {
    try {
      const tokenURI = await mintContract.tokenURI(tokenId);
      const price = await saleContract.getTokenPrice(tokenId);
      const { data }: { data: NftMetadata } = await axios.get(tokenURI);
      setMetadata({ ...data, price });
    } catch (e) {
      console.error(e);
    }
  };
  const getOwner = async () => {
    try {
      const ret = await mintContract.ownerOf(tokenId);
      setOwner(ret);
      console.log({ signerAd: signer.address, owner: ret });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!mintContract) return;
    getNftMetadata();
  }, [mintContract]);
  useEffect(() => {
    if (!signer || !mintContract) return;
    getOwner();
  }, [signer, mintContract]);
  return (
    <GridItem display="flex" flexDir="column">
      <Image alignSelf="center" src={metadata.image} alt={metadata.name} />
      <Popover>
        <PopoverTrigger>
          <Button mt={4} fontSize={24} fontWeight="semibold" variant="link">
            {metadata.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{metadata.description}</PopoverBody>
        </PopoverContent>
      </Popover>
      <Flex flexWrap="wrap" mt={4} gap={2}>
        {metadata.attributes?.map((w, j) => (
          <Box key={j} border="2px solid olive" p={1}>
            <Text borderBottom="2px solid olive">{w.trait_type}</Text>
            <Text>{w.value}</Text>
          </Box>
        ))}
      </Flex>
      <Flex mt={4}>
        <Text>
          {formatEther(metadata.price)} ETH
          {signer.address !== owner && (
            <Button
              ml={2}
              colorScheme="green"
              onClick={purchaseNft}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              구매
            </Button>
          )}
        </Text>
      </Flex>
    </GridItem>
  );
};

export default SaleNftCard;

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

interface SaleNftCardProps {
  nftMetadata: SaleNftMetadata;
  mintContract: Contract;
  saleContract: Contract;
  tokenId: number;
  signer: JsonRpcSigner;
  setNftMetadataArray: Dispatch<SetStateAction<SaleNftMetadata[]>>;
}
const SaleNftCard: FC<SaleNftCardProps> = ({
  nftMetadata,
  saleContract,
  mintContract,
  tokenId,
  signer,
  setNftMetadataArray,
}) => {
  const [owner, setOwner] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const purchaseNft = async () => {
    try {
      setIsLoading(true);
      await saleContract.purchaseNft(tokenId, {
        value: nftMetadata.price,
      });

      setNftMetadataArray((prev) =>
        prev.filter((v) => {
          if (v.name === nftMetadata.name) {
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
  const getOwner = async () => {
    try {
      const ret = await mintContract.owner();
      setOwner(ret);
      console.log({ signerAd: signer.address, owner: ret });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getOwner();
  }, []);
  return (
    <GridItem display="flex" flexDir="column">
      <Image
        alignSelf="center"
        src={nftMetadata.image}
        alt={nftMetadata.name}
      />
      <Popover>
        <PopoverTrigger>
          <Button mt={4} fontSize={24} fontWeight="semibold" variant="link">
            {nftMetadata.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{nftMetadata.description}</PopoverBody>
        </PopoverContent>
      </Popover>
      <Flex flexWrap="wrap" mt={4} gap={2}>
        {nftMetadata.attributes?.map((w, j) => (
          <Box key={j} border="2px solid olive" p={1}>
            <Text borderBottom="2px solid olive">{w.trait_type}</Text>
            <Text>{w.value}</Text>
          </Box>
        ))}
      </Flex>
      <Flex mt={4}>
        <Text>
          {formatEther(nftMetadata.price)} ETH
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

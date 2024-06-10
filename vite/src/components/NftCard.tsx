import { FC, useEffect, useState } from "react";
import {
  GridItem,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Button,
  Flex,
  Box,
  Text,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Contract, formatEther, parseEther } from "ethers";

interface NftCardProps {
  nftMetadata: NftMetadata;
  tokenId: number;
  saleContract: Contract;
}
const NftCard: FC<NftCardProps> = ({ nftMetadata, tokenId, saleContract }) => {
  const [currentPrice, setCurrentPrice] = useState<bigint>(0n);
  const [salePrice, setSalePrice] = useState<string>("");
  const getTokenPrice = async () => {
    try {
      const response = await saleContract.getTokenPrice(tokenId);
      setCurrentPrice(response);
    } catch (e) {
      console.error(e);
    }
  };

  const onClickSetForSaleNft = async () => {
    try {
      if (!salePrice) return;
      await saleContract.setForSaleNft(tokenId, parseEther(salePrice));
      setCurrentPrice(BigInt(salePrice));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (!saleContract || !tokenId) return;

    getTokenPrice();
  }, [saleContract, tokenId]);
  return (
    <GridItem display="flex" flexDir="column" onClick={getTokenPrice}>
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
        {currentPrice ? (
          <Text
            textColor={"white"}
            bgColor="black"
            borderRadius={32}
            padding="6px 12px"
            fontWeight={"semibold"}
          >
            {formatEther(currentPrice)} ETH
          </Text>
        ) : (
          <>
            <InputGroup>
              <Input
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
              <InputRightAddon>ETH</InputRightAddon>
            </InputGroup>
            <Button ml={2} onClick={onClickSetForSaleNft}>
              등록
            </Button>
          </>
        )}
      </Flex>
    </GridItem>
  );
};

export default NftCard;

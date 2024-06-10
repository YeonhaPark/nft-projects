import {
  Box,
  Grid,
  Flex,
  Text,
  GridItem,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import axios from "axios";
import { FC, lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
const LazyImage = lazy(() => import("../components/LazyImage"));

const MyNft: FC = () => {
  const navigate = useNavigate();
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const { signer, mintContract } = useOutletContext<OutletContext>();
  const getBalanceOf = async () => {
    try {
      const response = await mintContract.balanceOf(signer.address);
      setBalanceOf(Number(response));
    } catch (e) {
      console.error(e);
    }
  };

  const getNftMetadata = async () => {
    try {
      setIsLoading(true);
      const PAGE = 3;
      const temp: NftMetadata[] = [];

      for (let i = 0; i < PAGE; i++) {
        const tokenOfOwnerByIndex = await mintContract?.tokenOfOwnerByIndex(
          signer?.address,
          i + currentPage * PAGE
        );

        const tokenURI = await mintContract?.tokenURI(tokenOfOwnerByIndex);

        const axiosResponse = await axios.get<NftMetadata>(tokenURI);

        temp.push(axiosResponse.data);
        if (i + currentPage * PAGE + 1 == balanceOf) {
          setIsEnd(true);
          break;
        }
      }

      setNftMetadataArray([...nftMetadataArray, ...temp]);
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!balanceOf) return;
    getNftMetadata();
  }, [balanceOf]);

  useEffect(() => {
    if (signer && mintContract) {
      getBalanceOf();
    } else {
      navigate("/");
    }
  }, [signer, mintContract]);

  return (
    <Flex
      w="100%"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      mb={20}
      mt={8}
      gap={2}
    >
      {!signer && <Text>🦊 메타마스크 로그인이 필요합니다!</Text>}

      {balanceOf !== 0 && <Text>내 보유 NFT 갯수: {balanceOf}</Text>}
      <Grid
        py={5}
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={6}
      >
        <Suspense fallback={<div>Loading image...</div>}>
          {nftMetadataArray.map((metadata) => (
            <GridItem display={"flex"} flexDir={"column"} key={metadata.name}>
              <LazyImage src={metadata.image} alt={metadata.name} />
              <Popover>
                <PopoverTrigger>
                  <Button variant={"link"} fontWeight={"bold"}>
                    {metadata.name}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>{metadata.description}</PopoverBody>
                </PopoverContent>
              </Popover>
              <Text mt={4} fontSize={24}>
                {metadata.name}
              </Text>
              <Flex flexWrap={"wrap"} mt={4} gap={2}>
                {metadata.attributes?.map((el) => (
                  <Box key={el.trait_type} border="2px solid olive">
                    <Text borderBottom={"2px solid olive"}>
                      {el.trait_type}
                    </Text>
                    <Text>{el.value}</Text>
                  </Box>
                ))}
              </Flex>
            </GridItem>
          ))}
        </Suspense>
      </Grid>
      {signer && !isEnd && (
        <Button
          onClick={getNftMetadata}
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          더 보기
        </Button>
      )}
    </Flex>
  );
};

export default MyNft;

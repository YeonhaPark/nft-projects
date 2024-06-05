import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { FC, lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
const LazyImage = lazy(() => import("../components/LazyImage"));

const MyNft: FC = () => {
  const navigate = useNavigate();
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
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
      const temp = [];
      for (let i = 0; i < balanceOf; i++) {
        const tokenOfOwnerByIndex = await mintContract.tokenOfOwnerByIndex(
          signer.address,
          i
        );
        const tokenURI = await mintContract.tokenURI(tokenOfOwnerByIndex);
        const axiosResponse = await axios.get<NftMetadata>(tokenURI);
        const { data } = axiosResponse;
        temp.push(data);
      }
      setNftMetadataArray(temp);
    } catch (e) {
      console.error(e);
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
      gap={2}
    >
      {!signer && <Text>🦊 메타마스크 로그인이 필요합니다!</Text>}

      {balanceOf !== 0 && <Text>내 보유 NFT 갯수: {balanceOf}</Text>}
      <Suspense fallback={<div>Loading image...</div>}>
        {nftMetadataArray.map((metadata) => (
          <Flex key={metadata.name} flexDir={"column"}>
            <LazyImage src={metadata.image} alt={metadata.name} />
            <Text mt={4} fontSize={24}>
              {metadata.name}
            </Text>
            <Text mt={4}>{metadata.description}</Text>
            <Flex flexWrap={"wrap"} mt={4} gap={2}>
              {metadata.attributes?.map((el) => (
                <Box key={el.trait_type} border="2px solid olive">
                  <Text borderBottom={"2px solid olive"}>{el.trait_type}</Text>
                  <Text>{el.value}</Text>
                </Box>
              ))}
            </Flex>
          </Flex>
        ))}
      </Suspense>
    </Flex>
  );
};

export default MyNft;

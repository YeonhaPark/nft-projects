import { Box, Flex, Image } from "@chakra-ui/react";

const Slider = () => {
  const images = Array.from({ length: 6 }, (_, i) => `/images/${i + 1}.png`);

  return (
    <Flex overflow="hidden" width="100%">
      <Flex
        className="animation"
        minH={"calc(100vh - 120px)"}
        alignItems={"center"}
      >
        {images
          .concat(images)
          .concat(images)
          .map((src, i) => (
            <Box key={i} flexShrink={0} mx={2}>
              <Image width={80} height={80} src={src} alt={i + ""} />
            </Box>
          ))}
      </Flex>
    </Flex>
  );
};
export default Slider;

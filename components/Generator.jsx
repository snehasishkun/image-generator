import {
    Button,
    Center,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useToast,
    Image,
    Divider,
    Flex,
    IconButton
} from '@chakra-ui/react';
import { deleteCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import Confetti from 'react-dom-confetti';
import { FiLogOut } from 'react-icons/fi';

const confettiConfig = {
    angle: 90,
    spread: 100,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export default function Generator() {
    const [showImage, setShowImage] = useState(false);
    const [imageSrc, setImageSrc] = useState("none");
    const [apiKey, setApiKey] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const toast = useToast();

    function getAPIKey() {
        const api_key = getCookie('igma.api_key');
        if (!api_key || api_key === null || typeof api_key === 'undefined') return setApiKey(null);
        setApiKey(api_key);
    }

    async function generateImage() {
        if (!prompt || prompt === null || typeof prompt === 'undefined') return toast({
            position: 'top',
            status: 'error',
            title: 'Prompt is required.',
            duration: 6000,
            isClosable: true
        });
        if (!apiKey || apiKey === null || typeof apiKey === 'undefined') return toast({
            position: 'top',
            status: 'error',
            title: 'Cannot find API Key.',
            duration: 6000,
            isClosable: true
        });
        setButtonLoading(true);
        setShowConfetti(false);
        setShowImage(false);
        try {
            const imageRes = await fetch(`/api/generate?key=${encodeURIComponent(apiKey)}&prompt=${encodeURIComponent(prompt)}`).then((imageResp) => imageResp.json());

            if (imageRes.url) {
                setImageSrc(imageRes.url);
                setShowImage(true);
                setShowConfetti(true);
                setButtonLoading(false);
            } else {
                setButtonLoading(false);
                return toast({
                    position: 'top',
                    status: 'error',
                    title: 'Could not generate the Image.',
                    description: `${imageRes.message || "Invalid API Key."}`,
                    duration: 6000,
                    isClosable: true
                })
            }
        } catch (error) {
            setButtonLoading(false);
            return toast({
                position: 'top',
                status: 'error',
                title: 'Could not generate the Image.',
                description: `${error.message || "Invalid API Key."}`,
                duration: 6000,
                isClosable: true
            })
        }
    }

    function logout() {
        deleteCookie('igma.api_key');
        toast({
            position: 'top',
            status: 'success',
            title: 'Logged Out.',
            duration: 6000,
            isClosable: true
        })
        setTimeout(() => window.location.reload(), 1000);
    }

    useEffect(() => getAPIKey());

    return (
        <Center
            justify={'center'}
            align={'center'}
            py={12}
            px={4}
            >
            <Stack
            bg={useColorModeValue('gray.50', 'gray.700')}
            boxShadow={'2xl'}
            rounded={'xl'}
            p={10}
            spacing={3}
            boxSize={"lg"}
            height={"fit-content"}>
                <Flex justify={"space-between"} align={"flex-start"}>
                    <Text fontSize={"2xl"} fontWeight={"bold"} color={"green.500"}>IMAGE GENERATOR</Text>
                    <IconButton variant={"ghost"} icon={<FiLogOut/>} onClick={logout} colorScheme={"red"} />
                </Flex>
                <Stack align={'center'}>
                    <Text fontSize={'lg'} color={'gray.500'}>
                        What do you wish to generate?
                    </Text>
                </Stack>
                <Stack spacing={4} direction={"column"} w={'full'}>
                    <Input
                        type={'text'}
                        placeholder={'Enter your Prompt here.'}
                        color={useColorModeValue('gray.800', 'gray.200')}
                        bg={useColorModeValue('gray.100', 'gray.600')}
                        rounded={'full'}
                        border={0}
                        _focus={{
                            bg: useColorModeValue('gray.200', 'gray.800'),
                            outline: 'none',
                        }}
                        w={"full"}
                        onInput={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                        bg={'green.400'}
                        rounded={'full'}
                        color={'white'}
                        flex={'1 0 auto'}
                        _hover={{ bg: 'green.500' }}
                        _focus={{ bg: 'green.600' }}
                        onClick={generateImage}
                        isLoading={buttonLoading}>
                        Generate Image
                    </Button>
                </Stack>
                {
                    prompt !== null ?
                        <>

                            <Divider my={2} />
                            <Text fontWeight={"semibold"} mt={4}>Your Prompt</Text>
                            <Text>{prompt}</Text>
                        </>
                        : null
                }
                {
                    showImage ?
                        <>
                            <Divider my={6} />
                            <Image src={imageSrc} />
                            <Divider my={2} />
                            <Button onClick={() => window.location.href = `${imageSrc}`} colorScheme={"green"} rounded={"full"}>Open Image</Button>
                            <Button colorScheme={"blue"} rounded={"full"} onClick={() => window.navigator.clipboard.writeText(`${imageSrc}`)}>Copy Image URL</Button>
                        </>
                        : null
                }

                <Confetti active={showConfetti} config={confettiConfig} />
            </Stack>
        </Center>
    );
}

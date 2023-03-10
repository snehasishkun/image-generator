import React, { useState } from 'react';
import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Link,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Divider,
    useToast
} from '@chakra-ui/react';
import Head from 'next/head';
import { setCookie } from 'cookies-next';

export default function Authentication() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiKey, setApiKey] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const toast = useToast();

    function setAPIKey() {
        const api_key = apiKey;
        if (!api_key) return toast({
            position: 'top',
            status: 'error',
            title: 'API Key is required.',
            description: 'Your API Key is not stored with us. Click on "Security" for more info.',
            duration: 6000,
            isClosable: true
        });
        setButtonLoading(true);
        setCookie('igma.api_key', `${api_key}`, { maxAge: 2419200, secure: true });
        toast({
            position: 'top',
            status: 'success',
            title: 'Authentication Completed.',
            description: 'Your API Key has been stored in your browser cookies.',
            duration: 6000,
            isClosable: true
        });
        setTimeout(() => window.location.reload(), 1000);
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12} mx={4}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Authentication
                </Heading>
                <Text
                    fontSize={{ base: 'md', sm: 'lg' }}
                    fontWeight={"semibold"}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    Enter your <Link href={"/"} color={"green.500"}>OpenAI API Key</Link>
                </Text>
                <FormControl id="key-form">
                    <Input
                        placeholder="xxx-xxx-xxx-xxx"
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        id="key"
                        autoComplete="false"
                        onInput={(e) => setApiKey(e.target.value)}
                    />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        w={'full'}
                        bg={'green.400'}
                        color={'white'}
                        _hover={{
                            bg: 'green.500',
                        }}
                        onClick={setAPIKey}
                        isLoading={buttonLoading}>
                        Confirm
                    </Button>
                </Stack>
                <Stack spacing={6} direction={"row"}>
                    <Button
                        w={'full'}
                        bg={'red.400'}
                        color={'white'}
                        _hover={{
                            bg: 'red.500',
                        }}
                        onClick={onOpen}>
                        Security
                    </Button>
                    <Link href={"https://platform.openai.com/account/api-keys"} target={"_blank"} _hover={{ textDecor: "none" }}>
                        <Button
                            w={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Get an API Key
                        </Button>
                    </Link>
                </Stack>
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color={"green.500"}>Your OpenAI API Key</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>We do not store your API key in our database. In fact, we do not use any database, but your local storage and cookies. Your API Key which we use to send requests to the API, is stored in your browser cookies. The cookie name is {"'key'"}. Using this application is completely secure. We do not send requests to any third party API but only the <Link color={"green.500"} target={"_blank"} href={"https://openai.com/api"}>official OpenAI API</Link>. You can check out the <Link color={"green.500"} target={"_blank"} href={"https://github.com/snehasishkun/image-generator"}>source</Link> of this application at GitHub for further confirmations.</Text>
                        <Divider my={4} />
                        <Text>We only use your browser{"'"}s local storage and cookies to save your information for a limited time (28 days), after which you need to enter your API Key once more. You can logout, i.e. remove all your information from the browser with a logout button that is visible after you authenticate.</Text>
                    </ModalBody>
                    <Divider my={4} />
                    <ModalFooter>
                        <Link href={"https://github.com/snehasishkun/image-generator"} target={"_blank"} _hover={{ textDecor: "none" }}>
                            <Button
                                w={'full'}
                                bg={'green.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'green.500',
                                }}>
                                Source
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

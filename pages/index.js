import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import Authentication from '../components/Authentication';
import Generator from '../components/Generator';
import Head from 'next/head';

const metadata = {
	title: "Image Generator",
	description: "Enter a prompt and I will generate an image for you.",
	image: ""
}

export default function Home() {
	const [apiKey, setAPIKey] = useState("default");

	function getAPIKey() {
		const api_key = getCookie('igma.api_key');
		if (!api_key || typeof api_key === 'undefined') return setAPIKey(null);
		setAPIKey(api_key);
	}

	useEffect(() => getAPIKey());

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name='title' content={`${metadata.title}`} />
				<meta name='description' content={`${metadata.description}`} />
				<meta name='og:title' content={`${metadata.title}`} />
				<meta name='og:description' content={`${metadata.description}`} />
			</Head>
			{
				apiKey !== null ?
				<Generator />
				:
				<Authentication/>
			}
		</>
	)
}

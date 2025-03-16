import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Custom404 = () => {
  return (
    
    <div className="h-screen flex flex-col items-center justify-center">
      
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <p className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">Go back to Home</p>
      </Link>
      
    </div>
    
  );
};

export default Custom404;
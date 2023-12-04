'use client';

import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

export default function Providers({
  children,
  ...props
}: {
  children: React.ReactNode;
  props?: ThemeProviderProps;
}) {
  return (
    <NextThemeProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </NextThemeProvider>
  );
}

import React from 'react';
import GlobalStyles from '../styles/global';
import '../styles/prism.css';

// eslint-disable-next-line react/prop-types
const MyApp = ({ Component, pageProps }) => (
  <>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
    <GlobalStyles />
  </>
);

export default MyApp;

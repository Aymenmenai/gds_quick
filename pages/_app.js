import Layout from "@/components/global/layout/layout";
import useProtection from "@/components/logic/useProtection";
import "@/styles/globals.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

const queryCLient = new QueryClient();
export default function App({ Component, pageProps }) {
  useProtection();

  return (
    <QueryClientProvider client={queryCLient}>
      <Head>
        <title>{`RAIL-LOGISTIC | Gestion de stock`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

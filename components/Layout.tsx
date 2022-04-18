import React, { ReactElement } from 'react';
import { Container } from 'semantic-ui-react';
import Head from "next/head";
import Header from "components/Header";

type LayoutProps = {
    children: ReactElement
}

const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <div>
            <Container>
                <Head>
                    <link
                        rel="stylesheet"
                        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
                    ></link>
                </Head>
                <Header />
                {props.children}
            </Container>
        </div>
    );
};

export default Layout;

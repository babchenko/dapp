import React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import Campaign from 'ethereum/campaign';
import RequestRow from 'components/RequestRow';


export type Request = {
    description: string;
    value: string;
    recipient: string;
    complete: boolean;
    approverCount: number;
}

type RequestIndexProps = {
    requests: Request[];
    address: string;
    approversCount: number;
    requestCount: string;
}

const RequestIndex: NextPage<RequestIndexProps> = ({ requests, address, approversCount, requestCount }) => {
    const router = useRouter();

    const afterAction = () => {
        router.reload();
    }

    const renderRows = () => {
        return requests.map((request: any, index: number) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    approversCount={approversCount}
                    afterAction={afterAction}
                />
            );
        });
    }

    const { Header, Row, HeaderCell, Body } = Table;

    return (
        <Layout>
            <>
                <h3>Requests</h3>
                <Link href={`/campaigns/${address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{renderRows()}</Body>
                </Table>
                <div>Found {requestCount} requests.</div>
            </>
        </Layout>
    );
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const { address } = query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();


    let requests = await Promise.all(
        Array(parseInt(requestCount))
            // @ts-ignore
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
    );

    requests = requests.map((request) => ({
        description: request.description,
        value: request.value,
        recipient: request.recipient,
        complete: request.complete,
        approverCount: parseInt(request.approverCount)
    }));

    return {
        props: {
            address,
            requests,
            requestCount,
            approversCount,
        }
    };
}

export default RequestIndex;
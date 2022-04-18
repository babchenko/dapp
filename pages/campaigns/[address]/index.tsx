import React, { useCallback } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from 'components/Layout';
import Campaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';
import ContributeForm from 'components/ContributeForm';


type CampaignShowProps = {
  balance: string;
  manager: string;
  minimumContribution: string;
  requestsCount: string;
  approversCount: string;
  address: string;
};

const CampaignShow: NextPage<CampaignShowProps> = ({balance, address, manager, minimumContribution, requestsCount, approversCount}) => {

    const renderCards = useCallback(() => {
        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description:
                    "The manager created this campaign and can create requests to withdraw money",
                style: { overflowWrap: "break-word" },
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description:
                    "You must contribute at least this much wei to become an approver",
            },
            {
                header: requestsCount,
                meta: "Number of Requests",
                description:
                    "A request tries to withdraw money from the contract. Requests must be approved by approvers",
            },
            {
                header: approversCount,
                meta: "Number of Approvers",
                description:
                    "Number of people who have already donated to this campaign",
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: "Campaign Balance (ether)",
                description:
                    "The balance is how much money this campaign has left to spend.",
            },
        ];

        return <Card.Group items={items} />;
    }, []);

    const afterSubmit = () => {

    }

    return (
        <Layout>
            <>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>{renderCards()}</Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={address} afterSubmit={afterSubmit} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link href={`/campaigns/${address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        </Layout>
    );
}

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const campaign = Campaign(query.address);

    const summary = await campaign.methods.getSummary().call();
    /**
     *          address(this).balance,
     *             minimumContribution,
     *             requests.length,
     *             approversCount,
     *             manager
     */
    return {
        props: {
            address: query.address,
            balance: summary[0],
            minimumContribution: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        }
    };
}

export default CampaignShow;

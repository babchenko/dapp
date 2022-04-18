import React, { useCallback } from 'react';
import type { GetServerSideProps, NextPage } from 'next'
import { Button, Card } from 'semantic-ui-react'
import factory from 'ethereum/factory';
import Layout from 'components/Layout';
import Link from 'next/link';

interface CampaignData {
  header: string;
  description: string;
  fluid: boolean;
}

interface HomePageProps {
  campaigns: string[];
}

const Home: NextPage<HomePageProps> = ({ campaigns }) => {

  const renderCampaigns = useCallback(() => {
    const items = campaigns.map((address: string) => {
      return {
        header: address,
        description: (
            <Link href={`/campaigns/${address}`}>
              <a>View Campaign</a>
            </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }, [campaigns]);

  return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link href="/campaigns/new">
            <a>
              <Button
                  floated="right"
                  content="Create Campaign"
                  icon="add circle"
                  primary
              />
            </a>
          </Link>
          { renderCampaigns() }
        </div>
      </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req: NextApiRequest, res: NextApiResponse }) => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    }
  }
}

export default Home;
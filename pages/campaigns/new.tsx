import React, { ChangeEvent, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from 'components/Layout';
import factory from 'ethereum/factory';
import web3 from 'ethereum/web3';


const CampaignNew: NextPage = () => {
    const [minimumContribution, setMinimumContribution] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0],
                });

            router.push('/');
        } catch (err: any) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <>
                <h3>Create Campaign</h3>
                <Form onSubmit={onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={minimumContribution}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setMinimumContribution(event.target.value)}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={errorMessage} />
                    <Button loading={loading} primary>
                        Create!
                    </Button>
                </Form>
            </>
        </Layout>
    );
}

export default CampaignNew;

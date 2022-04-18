import React, { ChangeEvent, useEffect, useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';
import Layout from 'components/Layout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

type RequestNewProps = {
    address: string;
}

const RequestNew: NextPage<RequestNewProps> = ({address}) => {
    const [value, setValue] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [balance, setBalance] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const getBalance = async () => {
            const balance = await web3.eth.getBalance(address);
            setBalance(balance);
        }

        getBalance();
    }, [address, setBalance]);

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        if (balance < web3.utils.toWei(value, "ether")) {
            return setErrorMessage('Request value can`t be more than contribute balance');
        }

        const campaign = Campaign(address);

        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({from: accounts[0]});

            router.push(`/campaigns/${ address }/requests`);
        } catch (err: any) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    };

    const back = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/campaigns/${ address }/requests`)
    }

    return (
        <Layout>
            <>
                <h3>Create a Request</h3>
                <Form onSubmit={ onSubmit } error={ !!errorMessage } success>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={ description }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value) }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={ value }
                            onChange={ (event) => setValue(event.target.value) }
                            type='number'
                        />
                    </Form.Field>
                    { balance ? <Message
                        success
                        content={ `Total contribute balance is ${ web3.utils.fromWei(balance, 'ether') } ether` }
                    /> : null }
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={ recipient }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => setRecipient(event.target.value) }
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={ errorMessage }/>
                    <Button primary loading={ loading }>
                        Create!
                    </Button>
                    <Button color='red' onClick={ back }>Back</Button>
                </Form>
            </>
        </Layout>
    );
}

export const getServerSideProps = ({query}: GetServerSidePropsContext) => {
    let {address} = query;

    address = Array.isArray(address) ? address[0] : address;

    if (!address) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            address,
        }
    }
}

export default RequestNew;
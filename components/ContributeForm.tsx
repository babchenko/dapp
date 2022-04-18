import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from 'ethereum/campaign';
import web3 from 'ethereum/web3';
import { useRouter } from 'next/router';

type ContributeFormProps = {
    address: string;
};

const ContributeForm: React.FC<ContributeFormProps> = ({address}) => {
    const [value, setValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>();

    const router = useRouter();

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        const campaign = Campaign(address);

        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, "ether"),
            });

            router.reload();
        } catch (err: any) {
            setErrorMessage(err.message);
        }
        setLoading(false);
        setValue('');
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    label="ether"
                    labelPosition="right"
                />
            </Form.Field>
            <Message error header="Oops!" content={errorMessage} />
            <Button primary loading={loading}>
                Contribute!
            </Button>
        </Form>
    );
}

export default ContributeForm;

import React, { useEffect, useState } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from 'ethereum/web3';
import Campaign from 'ethereum/campaign';
import { Request } from 'pages/campaigns/[address]/requests';

type RequestRowProps = {
  id: number;
  request: Request;
  approversCount: number;
  address: string;
  afterAction: Function,
}


const RequestRow: React.FC<RequestRowProps> = ({ id, request, approversCount, address, afterAction }) => {
  const [account, setAccount] = useState<string>('');
  const [isApprover, setIsApprover] = useState<boolean>(false);
  const [canFinalize, setCanFinalize] = useState<boolean>(false);
  const campaign = Campaign(address);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    getAccount();
  }, [setAccount]);

  useEffect(() => {
    const checkAccount = async () => {
      if (account) {
        const isApprover = await campaign.methods.checkApprovals(account, id).call();
        console.log(id);
        setIsApprover(isApprover);
      }
    }

    checkAccount();
  }, [account, setIsApprover]);

  useEffect(() => {
    const checkIsManager = async () => {
      if (account) {
        const manager = await campaign.methods.manager().call();

        if (manager && manager === account) {
          setCanFinalize(true);
        }
      }
    }

    checkIsManager();
  }, [account, setCanFinalize])

  const onApprove = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });

    afterAction();
  };

  const onFinalize = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    try {
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
    } catch (e: any) {
        console.log(e.message);
    }

    afterAction();
  };

  const { Row, Cell } = Table;
  const readyToFinalize = request.approverCount > approversCount / 2;

  return (
      <Row
          disabled={request.complete}
          positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approverCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete || isApprover ? null : (
              <Button color="green" basic onClick={onApprove}>
                Approve
              </Button>
          )}
        </Cell>
        <Cell>
          {request.complete || !canFinalize ? null : (
              <Button color="teal" basic onClick={onFinalize}>
                Finalize
              </Button>
          )}
        </Cell>
      </Row>
  );

}

export default RequestRow;

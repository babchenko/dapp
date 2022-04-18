import web3 from './web3';


import CampaignContract from './build/Campaign.json';

const Campaign = (address: string | string[]) => {

    if (Array.isArray(address)) {
        address = address[0];
    }

    const { abi } = CampaignContract;

    // @ts-ignore
    return new web3.eth.Contract(abi, address);
}

export default Campaign;
import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

// @ts-ignore
const campaignFactory = new web3.eth.Contract(
    // @ts-ignore
    CampaignFactory.abi,
    '0x9fD9D7298e9704881d84984ea4EfE262EA1E324c'
);

export default campaignFactory;
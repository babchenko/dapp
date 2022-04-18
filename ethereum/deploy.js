const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('./compile');
const fsExtra = require('fs-extra');

const CampaignFactory = require('./build/CampaignFactory.json');
const Campaign = require('./build/Campaign.json');
const path = require('path');

const provider = new HDWalletProvider(
    'prefer swing person test quote scrap october nerve rapid uncover birth tornado',
    'https://rinkeby.infura.io/v3/6a25a3fa3f204496b2d7c651ca65b7ad'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const { abi, evm } = CampaignFactory;

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ gas: 3000000, from: accounts[0] });


  console.log('Contract deployed to', result.options.address);

  fsExtra.outputFileSync(
      path.resolve(__dirname, 'ADDRESS'),
      result.options.address
  );

  provider.engine.stop();
};

deploy();


const path = require('path');
const fsExtra = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fsExtra.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fsExtra.readFileSync(campaignPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

fsExtra.ensureDirSync(buildPath);

for (const contractFile in compiled.contracts) {
    const compiledContracts = compiled.contracts[contractFile];
    for (const contract in compiledContracts) {
        fsExtra.outputJsonSync(
            path.resolve(buildPath, `${contract}.json`),
            compiledContracts[contract]
        );
    }
}


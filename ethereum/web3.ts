import Web3 from "web3";
let web3: Web3;

// @ts-ignore
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    // @ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    // @ts-ignore
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/6a25a3fa3f204496b2d7c651ca65b7ad'
    );

    web3 = new Web3(provider);
}

export default web3;
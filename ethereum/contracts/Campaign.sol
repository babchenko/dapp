// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] deployedCampaign;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaign.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaign;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approverCount;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;

    uint public numRequests;
    uint public approversCount;

    mapping (address => bool) public approvers;
    mapping (address => mapping(uint => bool)) approvals;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function checkApprovals(address approver, uint index) public view returns (bool) {
        return approvals[approver][index];
    }

    function createRequest( string memory description, uint value, address payable recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approverCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!approvals[msg.sender][index]);
        /**
         * Set request id for current sender.
         */
        approvals[msg.sender][index] = true;
        request.approverCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        /**
         * Check is more then half of all apprrovers voited for this request.
         */
        require(request.approverCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);

        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            address(this).balance,
            minimumContribution,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
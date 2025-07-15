// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Medxact {
    event DocumentStored(
        address indexed uploader,
        string patientId,
        bytes32 documentHash,
        uint256 timestamp
    );

    struct DocumentRecord {
        bytes32 hash;
        uint256 timestamp;
    }

    mapping(address => DocumentRecord[]) public documents;

    function storeDocumentHash(
        string memory patientId,
        bytes32 documentHash
    ) public {
        documents[msg.sender].push(DocumentRecord({
            hash: documentHash,
            timestamp: block.timestamp
        }));

        emit DocumentStored(msg.sender, patientId, documentHash, block.timestamp);
    }

    function getDocuments(address user) public view returns (DocumentRecord[] memory) {
        return documents[user];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContentRegistry {
    struct Content {
        uint256 timestamp;
        string username;
    }

    mapping(string => Content) public contentMap;

    event ContentRegistered(string hashKey, string username, uint256 timestamp);

    function registerContent(string memory _hashKey, string memory _username, uint256 _timestamp) external {
        require(bytes(_hashKey).length > 0, "Hash key must not be empty");
        require(bytes(_username).length > 0, "Username must not be empty");
        
        require(contentMap[_hashKey].timestamp == 0, "Content already registered");

        contentMap[_hashKey] = Content(_timestamp, _username);
        emit ContentRegistered(_hashKey, _username, _timestamp);
    }

    function verifyContent(string memory _hashKey) external view returns (string memory, string memory, uint256) {
        require(bytes(_hashKey).length > 0, "Hash key must not be empty");
        
        Content memory content = contentMap[_hashKey];
    if (content.timestamp == 0) {
        return ("Invalid content", "", 0);
    } else {
        return (_hashKey, content.username, content.timestamp);
    }
    }
}

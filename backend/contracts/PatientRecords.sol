// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string uniqueId;
        string phoneNumber;
        string condition;
        string transactionHash;
    }

    mapping(address => Patient) private patients;

    event PatientAdded(
        address indexed patientAddress,
        string uniqueId,
        string phoneNumber,
        string condition,
        string transactionHash
    );

    function addPatient(
        string memory uniqueId,
        string memory phoneNumber,
        string memory condition,
        string memory transactionHash
    ) public {
        patients[msg.sender] = Patient(uniqueId, phoneNumber, condition, transactionHash);
        emit PatientAdded(msg.sender, uniqueId, phoneNumber, condition, transactionHash);
    }

    function getPatient(address patientAddress) public view returns (Patient memory) {
        return patients[patientAddress];
    }
}
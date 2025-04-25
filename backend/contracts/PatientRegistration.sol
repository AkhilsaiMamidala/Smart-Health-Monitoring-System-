// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRegistration {

    struct Patient {
        string uniqueId;
        string name;
        uint age;
        string gender;
        string phone;
        string patientAddress;  // Renamed from "address" to "patientAddress"
    }

    mapping(address => Patient) public patients;

    event PatientRegistered(
        string uniqueId,
        string name,
        uint age,
        string gender,
        string phone,
        string patientAddress // Renamed here as well
    );

    function addPatient(
        string memory _uniqueId, 
        string memory _name, 
        uint _age, 
        string memory _gender, 
        string memory _phone, 
        string memory _address // Renamed here
    ) public {
        patients[msg.sender] = Patient(_uniqueId, _name, _age, _gender, _phone, _address);
        emit PatientRegistered(_uniqueId, _name, _age, _gender, _phone, _address);
    }
}
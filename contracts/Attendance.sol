// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Attendance {
    
    address public teacher;
    uint256 public totalAttendance;

    // Track whether a student has marked attendance
    mapping(address => bool) public hasMarkedAttendance;

    // Store names of students
    mapping(address => string) public studentNames;

    // List of all students who marked attendance
    address[] public studentList;

    constructor() {
        teacher = msg.sender;
    }

    // Mark attendance
    function markAttendance(string memory name) public {
        require(!hasMarkedAttendance[msg.sender], "Attendance already marked");

        hasMarkedAttendance[msg.sender] = true;
        studentNames[msg.sender] = name;

        studentList.push(msg.sender);

        totalAttendance++;
    }

    // Verify if a student has marked attendance
    function verifyAttendance(address student) public view returns (bool) {
        return hasMarkedAttendance[student];
    }

    // Get total number of students who marked attendance
    function getTotalAttendance() public view returns (uint256) {
        return totalAttendance;
    }

    // Get all student names (teacher only)
    function getAllStudents() public view returns (address[] memory, string[] memory) {
        require(msg.sender == teacher, "Only teacher can view full list");

        string[] memory names = new string[](studentList.length);

        for (uint256 i = 0; i < studentList.length; i++) {
            names[i] = studentNames[studentList[i]];
        }

        return (studentList, names);
    }
}

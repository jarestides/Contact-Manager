<?php

    $inData = getRequestInfo();
    
    $id = $inData["id"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phoneNum"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? ");
            $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $id);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithInfo($id, $firstName, $lastName);
        }
        else
        {
            returnWithError("No Records Found");
        }

        $stmt->close();
        $conn->close();
    }
    
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $id, $firstName ,$lastName)
    {
        $retValue = '{"id":"' . $id . '" , "firstName":"' . $firstName . '" , "lastName":"' . $lastName . '", "error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
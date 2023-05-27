<?php
	$inData = getRequestInfo();
	
	$firstName = "";
	$lastName = "";
	$id = $inData["id"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT FirstName,LastName FROM Contacts WHERE ID=?");
        	$stmt->bind_param("s", $id);
        	$stmt->execute();
        	$result = $stmt->get_result();
		if( $row = $result->fetch_assoc() )
		{
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];

			$stmt = $conn->prepare("DELETE from Contacts where ID=?");
			$stmt->bind_param("s", $id);
			$status = $stmt->execute();
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id, $firstName ,$lastName)
    	{
        	$retValue = '{"id":"' . $id . '" , "firstName":"' . $firstName . '" , "lastName":"' . $lastName . '", "error":""}';
        	sendResultInfoAsJson( $retValue );
    	}
	
?>
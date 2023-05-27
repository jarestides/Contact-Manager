<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNum = $inData["phoneNum"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
            $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Contacts WHERE FirstName=? AND LastName =? AND UserID =?");
            $stmt->bind_param("sss", $firstName, $lastName, $userId);
            $stmt->execute();
            $result = $stmt->get_result();

            if( $row = $result->fetch_assoc()  ){
                returnWithError("Contact already exists");
            }
            else{
			$sql = "INSERT INTO Contacts (UserID,FirstName,LastName,Phone,Email) VALUES ('".$userId."','".$firstName."','".$lastName."','".$phoneNum."','".$email."')";
		
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}
 			else 
 			{
				$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Contacts WHERE FirstName=? AND LastName =?");
            		$stmt->bind_param("ss", $firstName, $lastName);
            		$stmt->execute();
            		$result = $stmt->get_result();
            		$row = $result->fetch_assoc();
                		returnWithInfo($firstName, $lastName, $row["ID"]);
				$stmt->close();
            		$conn->close();
 			}
			$conn->close();
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

	function returnWithInfo( $FirstName, $LastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $FirstName . '","lastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
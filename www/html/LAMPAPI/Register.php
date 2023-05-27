<?php header("Access-Control-Allow-Origin: *");
    
        $inData = getRequestInfo();

        $id = 0;
        $firstName = "";
        $lastName = "";
        $email = "";
        $login = "";
        $password = "";
		$confirmPassword = "";

        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if( $conn->connect_error ){
                returnWithError( $conn->connect_error );
        }
        else
        {
            $firstName = $inData["firstName"];
            $lastName = $inData["lastName"];
            $login = $inData["login"];
            $password = $inData["password"];
			$confirmPassword = $inData["confirmPassword"];
			
            $email = $inData["email"];

            if (!$firstName || !$lastName || !$login || !$password || !$email || !$confirmPassword) {
                returnWithError( "Please fill out all the fields." );
                return;
            }
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? OR Email =?");
            $stmt->bind_param("ss", $login, $email);
            $stmt->execute();
            $result = $stmt->get_result();

			if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
				returnWithError("Please enter a valid email.");
				return;
			}
			else if (strcmp($password, $confirmPassword) !== 0) {
				returnWithError("Passwords do not match.");
				return;
			}
			else if( $row = $result->fetch_assoc() ){
                returnWithError("Account already exists.");
				return;
            }
            else{
            	$sql = "INSERT INTO Users (FirstName, LastName, Login, Password, Email) 
            	VALUES ('".$firstName."', '".$lastName."', '".$login."', '".$password."', '".$email."')";
            	if( $result = $conn->query($sql) != TRUE )
            	{
                		returnWithError( $conn->error );
                		return;
            	}
            	returnWithInfo();
            	$conn->close();
		}
		
		$stmt->close();
		$conn->close();
        }

        function getRequestInfo(){
            return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj ){
            header('Content-type: application/json');
            echo $obj;
        }

        function returnWithError( $err ){
            $retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo()
        {

        $retValue = '{
                    "id":"' .$id. '",
                    "firstName":"' . $firstName . '",
                    "lastName":"' . $lastName . '", 
                    "login":"'. $login .'",
                    "password":"' . $password . '"
                    }';
            sendResultInfoAsJson( $retValue );
        } 

?>
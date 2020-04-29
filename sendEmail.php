<?php
    use PHPMailer\PHPMailer\PHPMailer;

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "contact_form";

    // ** PHP MySQL Prepared Statements
    // ** https://www.w3schools.com/php/php_mysql_prepared_statements.asp
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    

    $firstName = trim($_POST['firstName']);
    $lastName = trim($_POST['lastName']);
    $email = trim($_POST['email']);
    $contact = preg_replace('/\D+/', '', trim($_POST['contact'])); // Save contact number without characters, spaces
    $message = $_POST['message'];
    header('Content-Type: application/json');


    // Cross Validation in PHP side
    if($firstName === '') {
        print json_encode(array('message' => 'Firstname cannot be empty.', 'status' => 'fail'));
        exit();
    }                
    if ($email === ''){
        print json_encode(array('message' => 'Email cannot be empty.', 'status' => 'fail'));
        exit();
    } else {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
            print json_encode(array('message' => 'Email format invalid.', 'status' => 'fail'));
            exit();
        }
    }
    if($contact === '') {
        print json_encode(array('message' => 'Contact number is required.', 'status' => 'fail'));
        exit();
    }            
    if($message === '') {
        print json_encode(array('message' => 'Message cannot be empty.', 'status' => 'fail'));
        exit();
    }
    
    
        // Server: prepare and bind
        $stmt = $conn->prepare("INSERT INTO contact(firstName, lastName, emailAddress, contactNumber, textMessage) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $contact, $message);
    
        $stmt->execute();
        $stmt->close();

        // Send Email
        require_once "PHPMailer/PHPMailer.php";
        require_once "PHPMailer/SMTP.php";
        require_once "PHPMailer/Exception.php";

        $mail = new PHPMailer();

        // SMTP Settings
        $mail->isSMTP();
        $mail->Host = "smtp.gmail.com";
        $mail->SMTPAuth = true;
        $mail->Username = "grace.dev.test@gmail.com"; //registed email
        $mail->Password = '1b7EssU&NOqy';
        $mail->Port = 465; //587
        $mail->SMTPSecure = "ssl"; //tls

        // Recipient 1 - Admin Users
        $mail->setFrom("grace.dev.test@gmail.com", "GRACE WEBSITE");
        $mail->addAddress("grace.dev.test@gmail.com"); // Admin user
        $mail->addReplyTo($email, $firstName);
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New message from ' . $firstName;
        $mail->Body = '<h2 style="color: #0a8cd2;">' . $firstName . ' ' . $lastName . ' has filled out the contact form.</h2><p><span style="margin: 0 0 1em; text-decoration: underline;">Contact Number: </span>' . $contact . '</p><p><span style="margin: 0 0 1em; text-decoration: underline;">Email: </span>' . $email . '</p><p><span style="margin: 0 0 1em; text-decoration: underline;">Message: </span>' . $message . '</p><p style="color: #0a8cd2;">To reply to the customer, simply click <strong>"Reply"</strong></p>';

        $mail->AltBody = $firstName . ' ' . $lastName . ' has filled out the contact form. | Contact Number: ' . $contact. ' | Email: ' . $email . ' | Message: ' . $message . ' | To reply to the customer, simply click "Reply"';
        
        if ($mail->send()) {
            $status = "success";
            $response = "Email is sent!";
        } else {
            $status = "fail";
            $response = "Something is wrong: " . $mail->ErrorInfo;
        }

        $mail->ClearAllRecipients();

        // Recipient 2 - Confirmation Email
        $mail->setFrom("grace.dev.test@gmail.com", "GRACE WEBSITE");
        $mail->addAddress($email); // The contact form writer
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Thank you ' . $firstName . ' for contacting us!';
        $mail->Body = '<h2 style="color: #0a8cd2;">Hi ' . $firstName . ', </h2><p>We have recieved your inquiry and will respond to you very soon.</p><p style="color: #0a8cd2;">Any questions? Check out our <strong>website</strong>.</p>';
        $mail->AltBody = 'Hi ' . $firstName . ', We have recieved your email. We will get back to you as soon as possible. Any questions? Check out our website.';
        
        if ($mail->send()) {
            $status = "success";
            $response = "Email is sent!";
        } else {
            $status = "fail";
            $response = "Something is wrong: " . $mail->ErrorInfo;
        }


        exit(json_encode(array("message" => $response, "status" => $status)));
?>
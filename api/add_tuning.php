<?php
// Check if a file has been uploaded
if(isset($_FILES['uploaded_file'])) {
    // Make sure the file was sent without errors
    if($_FILES['uploaded_file']['error'] == 0) {
        // Connect to the database

        $dbname = 'localhost';
        $dbuser = 'root';
        //$dbpass = 'd1sc0v3ry';
        $dbpass = 'root';
        $db = 'AutoTracker';

        $dbLink = new mysqli($dbname, $dbuser, $dbpass, $db);
        //$dbLink = new mysqli('localhost', 'root', 'd1sc0v3ry', 'AutoTracker');

        if(mysqli_connect_errno()) {
            die("MySQL connection failed: ". mysqli_connect_error());
        }

        // Gather all required data
        //$name = $dbLink->real_escape_string($_FILES['uploaded_file']['name']);
        //$mime = $dbLink->real_escape_string($_FILES['uploaded_file']['type']);
        //$data = $dbLink->real_escape_string(file_get_contents($_FILES  ['uploaded_file']['tmp_name']));
        //$size = intval($_FILES['uploaded_file']['size']);

        // Create the SQL query
        $t = $_FILES  ['uploaded_file']['tmp_name'];

        //echo $t;
        // Execute the query
        //$result = $dbLink->query($query);
        if($_FILES['uploaded_file']['error']==0) echo "Initial check success<br/>";

        //if ( !move_uploaded_file($t, "/uploads/") )
          //  echo "Could not copy CSV file to temporary directory ready for importing.";

                    $sql = "LOAD DATA LOCAL INFILE '".$t."'
                   INTO TABLE weekly_tuning
                   FIELDS TERMINATED BY ','
                   OPTIONALLY ENCLOSED BY '\"'
                   LINES TERMINATED BY '\\n'
                 (net, date, demo, stream, reach_aa, reach_imp, freq, mins_viewed, duration);";

                   //echo $sql;

            $dbLink = new mysqli($dbname, $dbuser, $dbpass, $db);
            // Check connection
            if (mysqli_connect_errno()) {
              echo "Failed to connect to MySQL: " . mysqli_connect_errno() . mysqli_connect_error();
            };

            $result = mysqli_query($dbLink, $sql);

            if ($result) {
              $message = "The data was successfully added!";
            } else {
              $message = "The user update failed: ";
              $message .= mysqli_error($dbLink)." ---> ".$result;
            };

            echo $message;
            mysqli_close($dbLink);
    }
    else {
        echo 'An error accured while the file was being uploaded. '
           . 'Error code: '. intval($_FILES['uploaded_file']['error']);
    }
    // Close the mysql connection
    //$dbLink->close();
}
else {
    echo 'Error! A file was not sent!';
}

echo '<p>Click <a href="index.html">here</a> to go back</p>';
?>

<?php
// Check if a file has been uploaded
if(isset($_FILES['uploaded_file'])) {
    // Make sure the file was sent without errors
    if($_FILES['uploaded_file']['error'] == 0) {
        // Connect to the database
        $dbLink = new mysqli('localhost', 'root', 'root', 'AutoTracker');
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
        
        echo $t;
        // Execute the query
        //$result = $dbLink->query($query);
        if($_FILES['uploaded_file']['error']==0) echo "Initial check success<br/>".file_get_contents($_FILES  ['uploaded_file']['tmp_name'])."<br/>";

        //if ( !move_uploaded_file($t, "/uploads/") )
          //  echo "Could not copy CSV file to temporary directory ready for importing.";
         
        //$query = $this->db->query("LOAD DATA INFILE ? REPLACE INTO TABLE timebased_data FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\\n' (@dummy, net, date, period, type, stream, demo, value, duration)",array('/tmp/'.$file));
                    $sql = "LOAD DATA LOCAL INFILE '".$t."'
                   INTO TABLE AutoTracker.timebased_data
                   FIELDS TERMINATED BY ','
                   OPTIONALLY ENCLOSED BY '\"' 
                   LINES TERMINATED BY '\\n' 
                 (@dummy, net, date, period, @dummy, type, stream, demo, rating_val, duration);";

                   echo $sql;

            $con=mysqli_connect("localhost","root","root","AutoTracker");
            // Check connection
            if (mysqli_connect_errno()) {
              echo "Failed to connect to MySQL: " . mysqli_connect_error();
            };

            $result = mysqli_query($con, $sql);

            if (mysqli_affected_rows($con) == 1) {
              $message = "The data was successfully added!";
            } else {
              $message = "The user update failed: ";
              $message .= mysqli_error($con); 
            };

            echo $message;
            mysqli_close($con);
        
    }
    else {
        echo 'An error accured while the file was being uploaded. '
           . 'Error code: '. intval($_FILES['uploaded_file']['error']);
    }
 
    // Close the mysql connection
    $dbLink->close();
}
else {
    echo 'Error! A file was not sent!';
}
 
// Echo a link back to the main page
echo '<p>Click <a href="index.html">here</a> to go back</p>';
?>

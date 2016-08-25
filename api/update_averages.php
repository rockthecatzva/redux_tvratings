<?php

$dbLink = new mysqli('localhost', 'root', 'root', 'AutoTracker');
if(mysqli_connect_errno()) {
  die("MySQL connection failed: ". mysqli_connect_error());
}

        
$sql = "LOAD DATA LOCAL INFILE '".$t."'
INTO TABLE AutoTracker.timebased_data
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '\"' 
LINES TERMINATED BY '\\n' 
(@dummy, net, date, period, @dummy, type, stream, demo, rating_val, duration);";

        
$con=mysqli_connect("localhost","root","root","AutoTracker");
            // Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
};

$result = mysqli_query($con, $sql);

if (mysqli_affected_rows($con) == 1) {
  $message = "Tables were successfully updated";
} else {
  $message = "Update failed: ";
  $message .= mysqli_error($con); 
};

echo $message;
mysqli_close($con);


else {
  echo 'An error accured while the file was being uploaded. '
  . 'Error code: '. intval($_FILES['uploaded_file']['error']);
}

    // Close the mysql connection
$dbLink->close();

else {
  echo 'Error! A file was not sent!';
}

// Echo a link back to the main page
echo '<p>Click <a href="index.html">here</a> to go back</p>';
?>

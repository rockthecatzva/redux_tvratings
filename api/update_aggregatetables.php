<?php

// Connect to the database
  $dbLink = new mysqli('localhost', 'root', 'root', 'AutoTracker');
  if(mysqli_connect_errno()) {
    die("MySQL connection failed: ". mysqli_connect_error());
  }
  $con=mysqli_connect("localhost","root","root","AutoTracker");
  // Check connection
  if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  };

//UPDATE DAYPART AVERAGES
  $sql = "REPLACE INTO ag_dayparts (net, type, stream, demo, daypart, rating_val, duration, period) SELECT net, type, stream, demo, daypart, avg(rating_val) AS rating_val, sum(duration) AS duration, qtrs.label as period FROM daypart_ratings LEFT JOIN bcast_quarters as qtrs ON (date>=qtrs.start and date<=qtrs.stop) GROUP BY net, type, demo, stream, period, daypart;";



  $result = mysqli_query($con, $sql);

  if ($result) {
    $message = "The data was successfully added!";
  } else {
    $message = "The user update failed: ";
    $message .= mysqli_error($con);
  };

  echo $message;

//UPDATE PREMIERE AVERAGE TABLE

  $sql = "REPLACE INTO ag_premavgs (net, period, type, stream, demo, rating_val, duration)
  SELECT tr.net as net, qtrs.label as period, tr.rating_type as type, tr.data_stream as stream, tr.demo as demo, SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ) AS rating_val, SUM(ti.duration) as duration
      FROM telecast_info ti
      LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time
      LEFT JOIN bcast_quarters as qtrs ON (tr.date_time>=qtrs.start and tr.date_time<=qtrs.stop)
      WHERE (ti.telecast_code NOT LIKE '%R%')
      GROUP BY net, type, demo, stream, period;";

  $result = mysqli_query($con, $sql);

  if ($result) {
    $message = "The data was successfully added!";
  } else {
    $message = "The user update failed: ";
    $message .= mysqli_error($con);
  };

  echo $message;



  mysqli_close($con);

  // Close the mysql connection
  $dbLink->close();

?>

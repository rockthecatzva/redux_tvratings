<!DOCTYPE html>
<head>
    <title>Time-Based Data Upload</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="jquery/dist/jquery.min.js"></script>
    <script type="text/javascript">

    var updateDayparts = function(){
      $.ajaxSetup({
          timeout: 500000
        });

    	$.post('update_aggregatetables.php',
				  	{},
				  	function() {
				  		alert("Success");
						}
					);
    }

    </script>

    <style>
      .section{
        border: solid 1px;
      }
    </style>

</head>
<body>

	<div class="section">
		<h1>Daily Time-Based Data</h1>
	    <form action="add_file.php" method="post" enctype="multipart/form-data">
	        <input type="file" name="uploaded_file"><br>
	        <input type="submit" value="Upload file">
	    </form>
	    <br/>
	    <button type="button" id="update_daypartavgs" onclick="updateDayparts();">Update Daypart Averages</button>
	</div>

  <br/>

  <div class="section">
    <h2>Tuning Data</h2>
    <form action="add_tuning.php" method="post" enctype="multipart/form-data">
        <input type="file" name="uploaded_file"><br>
        <input type="submit" value="Upload file">
    </form>
    <br/>
    <button type="button" id="update_daypartavgs" onclick="updateTuningAvgs();">Update TUNING Averages</button>
  </div>

</body>
</html>

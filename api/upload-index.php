<!DOCTYPE html>
<head>
    <title>Time-Based Data Upload</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">


    <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript">

    var updateAverages = function(){
    	
    	$.post('index.php/updateAverages',
				  	{},
				  	function() {
				  		alert("Success");
						} 
					);

    }

    </script>
</head>
<body>

	<div>
		<h1>Daily Time-Based Data</h1>
	    <form action="add_file.php" method="post" enctype="multipart/form-data">
	        <input type="file" name="uploaded_file"><br>
	        <input type="submit" value="Upload file">
	    </form>


	    <br/>

	    <button type="button" id="update_averages" onclick="updateAverages();">Update Averages</button>


	</div>
    
</body>
</html>
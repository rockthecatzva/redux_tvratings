<?php

require 'vendor/autoload.php';

function getDB()
{
    $dbhost = "localhost";

    
    $dbuser = "root";
    $dbpass = "root";
    $dbname = "AutoTracker";


/*
    $dbuser = "rockthe2";
    $dbpass = "Puppies1!";
    $dbname = "rockthe2_TVRatings"; 

*/
    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass); 
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}

$app = new \Slim\Slim();

$app->get('/', function() use($app) {
    $app->response->setStatus(200);
    echo "Welcome to Slim based API";
}); 

///:startdate/:stopdate/:demo/:stream
//, $startdate, $stopdate, $demo, $stream


//ESSEnTIAL - otherwise json_encode returns empty string
function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}





$app->get('/gridData/', function () {
    $app = \Slim\Slim::getInstance();

    $net = $app->request->get('net');
    $streams = $app->request->get('stream');
    $metrics = $app->request->get('metric');
    $demos = $app->request->get('demo');
    $starttime = $app->request->get('starttime');
    $stoptime = $app->request->get('stoptime');
    $weeks = $app->request->get('weeks');

    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT tr.net, tr.date_time, tr.rating_type, tr.data_stream, tr.demo, tr.rating_val, cl.clean_name as telecast_name, ti.telecast_episode, ti.dow, ti.duration, ti.telecast_code 
            FROM telecast_info ti LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time JOIN cleanlist_series cl ON cl.id = ti.seriesId 
            WHERE (tr.date_time >= :startdate AND tr.date_time <= :stopdate) AND (tr.net = :net)
            AND (tr.rating_type='aa' AND tr.data_stream= :stream AND tr.demo= :demo)
            ORDER BY tr.net, tr.date_time;");

        $starttime = $starttime." 00:00:00";
        $stoptime = $stoptime." 24:00:00";
        $sth->bindParam(':net', $net);
        $sth->bindParam(':startdate', $startdate);
        $sth->bindParam(':stopdate', $stopdate);
        $sth->bindParam(':demo', $demo);
        $sth->bindParam(':stream', $stream);


        $sth->execute();

        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            
            $db = null;
        } else {
            throw new PDOException('No records found.');


        }

    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});


/*
$app->get('/telecastLists/', function () {
    $app = \Slim\Slim::getInstance();
    
    //echo "here";
    //echo ($app->request->get('sDate'));    
    $net = $app->request->get('net');
    $clean_name = $app->request->get('clean_name');
    $streams = $app->request->get('streams');
    $metrics = $app->request->get('metrics');
    $demos = $app->request->get('demos');
    $premstatus = $app->request->get('premstatus');
        //$streams = $streams[0];

    try 
    {   
        $qstr = "SELECT qtr.label as quarter, tr.net, tr.rating_type, tr.data_stream, ti.date_time, tr.demo, tr.rating_val, ti.telecast_episode, ti.telecast_code, ti.duration 
        FROM telecast_info ti LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time 
        JOIN cleanlist_series cl ON cl.id=ti.seriesId JOIN bcast_quarters qtr on (ti.date_time>=qtr.start AND ti.date_time<=qtr.stop) 
        WHERE (cl.clean_name= :clean_name AND tr.net = :net )";


        $isFirst = true;

        if($streams){
            $qstr = $qstr." AND (";

                foreach ($streams as $s)
                {
                    if($isFirst)
                    {
                        $isFirst=false;
                    }
                    else{
                        $qstr = $qstr." OR ";                    
                    }

                    $qstr = $qstr." tr.data_stream='".$s."' ";
                }


                $qstr = $qstr.")";
}


$isFirst = true;
if($metrics){
    $qstr = $qstr." AND (";

        foreach ($metrics as $m)
        {
            if($isFirst)
            {
                $isFirst=false;
            }
            else{
                $qstr = $qstr." OR ";                    
            }

            $qstr = $qstr." tr.rating_type='".$m."' ";
        }


        $qstr = $qstr.")";
}


$isFirst = true;
if($demos){
    $qstr = $qstr." AND (";

        foreach ($demos as $d)
        {
            if($isFirst)
            {
                $isFirst=false;
            }
            else{
                $qstr = $qstr." OR ";                    
            }

            $qstr = $qstr." tr.demo='".$d."' ";
        }


        $qstr = $qstr.")";
}



switch($premstatus)
{
    case "premieres":
    $qstr = $qstr."AND ti.telecast_code NOT LIKE '%R%'";
    break;
    case "repeats":
    $qstr = $qstr."AND ti.telecast_code LIKE '%R%'";
    break;
}



$qstr = $qstr."ORDER BY tr.date_time, tr.data_stream, tr.rating_type";

$db = getDB();
$sth = $db->prepare($qstr);
        /*
        $startdate = $startdate." 00:00:00";
        $stopdate = $stopdate." 24:00:00";
        //echo $sth;
        
        $sth->bindParam(':startdate', $startdate);
        $sth->bindParam(':stopdate', $stopdate);
        $sth->bindParam(':demo', $demo);
        

*/

        /*
        $sth->bindParam(':net', $net);
        $sth->bindParam(':clean_name', $clean_name);
        //$sth->bindParam(':streams', $streams);

        $sth->execute();

        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }

    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});
*/

/*
$app->get('/grocery/', function () {
    $app = \Slim\Slim::getInstance();

    try 
    {   

        $stream = $app->request->get('stream');

        $shop = array(
            $stream
            );

        $app->response->setStatus(200);
        $app->response()->headers->set('Content-Type', 'application/json');
        echo json_encode($shop);



        

    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});
*/


/*
------------- TIMEBASED_DATA --------------------

SELECT month.month, month.year, rat.net, rat.type, rat.stream, rat.demo, SUM( rat.rating_val * rat.duration ) / SUM( rat.duration ) as rating_val, SUM(rat.duration) as duration 
FROM timebased_data rat  
JOIN bcast_months month on (rat.date>=month.start AND rat.date<=month.stop) 
WHERE (rat.net = 'DISC' AND rat.demo="p25_54" AND rat.type="aa") 
GROUP BY rat.net, month.month, month.year, rat.type, rat.stream, rat.demo 
ORDER BY month.start;
*/

$app->get('/getTimedata/', function () {
    $app = \Slim\Slim::getInstance();
    $nets = $app->request->get('nets');
    $streams = $app->request->get('streams');
    $metric = $app->request->get('metric');
    $demos = $app->request->get('demos');
    //$starttime = $app->request->get('starttime');
    //$weeks = $app->request->get('weeks');

    try 
    {       
        //select tr.rating_type, SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ) as rating_val, SUM(ti.duration) as duration  FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net="DISC" AND tr.rating_type="m25_54 skew");
        $db = getDB();
        $qry = 'SELECT month.month, month.year, rat.net, rat.type, rat.stream, rat.demo, SUM( rat.rating_val * rat.duration ) / SUM( rat.duration ) as rating_val, SUM(rat.duration) as duration 
                    FROM timebased_data rat  
                    JOIN bcast_months month on (rat.date>=month.start AND rat.date<=month.stop) 
                    WHERE ';

         if(is_array($nets)){
                $len = count($nets) - 1;
                $select = '(';
                    foreach ($nets as $i => $net) {
                        $select = $select.'rat.net = "'.$net.'" ';
                        if($i < $len){
                            $select = $select.'OR ';
                        }
                    }    
                    $select = $select.') ';

            }
            else{
                $select = 'rat.net = "'.$nets.'" ';
        }


        


        $qry = $qry.$select.' AND rat.demo="p25_54" AND rat.type="'.$metric.'" 
                    GROUP BY rat.net, month.month, month.year, rat.type, rat.stream, rat.demo 
                    ORDER BY month.start;';

        //echo $qry;

        $sth = $db->prepare($qry);
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');


            //sort the data into seperate arrays - for each combo of demo/stream/net/
            $finalSet = array();

            foreach ($data as $i => $tempval) {
                # code...
                //echo $tempval['net'];
                $found = false;
                foreach ($finalSet as $b => $finalval) {
                    if(($finalval[0]['net']==$tempval['net'])&&($finalval[0]['stream']==$tempval['stream'])&&($finalval[0]['demo']==$tempval['demo'])){
                        $found= true;
                        //echo "FOUND!!!!".$finalval[0]['net']." ".$tempval['net'];
                        $finalSet[$b][] = $tempval;
                    }
                }

                if(!$found){
                    $finalSet[]=array($tempval);
                    $found = false;
                }
            }

            //echo gettype($data);

            //echo json_encode(utf8ize($data));
            echo json_encode(utf8ize($finalSet));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/getaverage/', function () {
    $app = \Slim\Slim::getInstance();
    $net = $app->request->get('net');
    $stream = $app->request->get('stream');
    $metric = $app->request->get('metric');
    $demo = $app->request->get('demo');
    $starttime = $app->request->get('starttime');
    $weeks = $app->request->get('weeks');

    try 
    {       
        $qry = "SELECT avg(tr.rating_val) as rating, SUM(ti.duration) as duration FROM telecast_info ti LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (ti.net = '".$net."' AND tr.rating_type='".$metric."' AND tr.data_stream='".$stream."'";//
        

        if($demo){
            $qry = $qry." AND tr.demo='".$demo."' ";
        }

        $qry = $qry."AND ti.date_time <= '".$starttime."' AND ti.date_time >= DATE_ADD('".$starttime."',INTERVAL -".$weeks." WEEK));"; 

        $db = getDB();
       // $sth = $db->prepare("SELECT ROUND(SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ), 1) as val FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net='".$net."' AND tr.rating_type='m25_54 skew');");
        //echo $qry;

$sth = $db->prepare($qry);
$sth->execute();
        $data = $sth->fetch(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});






$app->get('/getweeklylist/', function () {
    $app = \Slim\Slim::getInstance();

    $net = $app->request->get('net');
    $streams = $app->request->get('streams');
    $metrics = $app->request->get('metrics');
    $demos = $app->request->get('demos');
    $starttime = $app->request->get('starttime');
    $weeks = $app->request->get('weeks');

    try 
    {       
//SELECT avg(tr.rating_val) as rating_avg, WEEK(tr.date_time,1) as wk, tr.date_time FROM telecast_info ti LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (ti.net = "APL" AND tr.rating_type="aa" AND tr.data_stream="lsd" AND tr.demo = "P25_54") GROUP BY WEEK(tr.date_time,1)        
        $db = getDB();
       // $sth = $db->prepare("SELECT ROUND(SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ), 1) as val FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net='".$net."' AND tr.rating_type='m25_54 skew');");
        
        



        $select = "SELECT tr.rating_val, cl.clean_name, ti.telecast_code, ti.duration, ti.telecast_episode, concat_ws('-', tr.rating_type, tr.data_stream, tr.demo) as data_label, tr.date_time";
        //$select = "SELECT tr.rating_val, tr.date_time";

        $where = "WHERE (";

    $where = $where."ti.net = '".$net."' AND ";


if(is_array($streams)){
    $select = $select.", tr.data_stream ";
    //$groupby = $groupby.", tr.data_stream ";

    $len = count($streams) - 1;
    $where = $where."(";
        foreach ($streams as $i => $stream) {
            $where = $where."tr.data_stream = '".$stream."' ";
            if($i < $len){
                $where = $where."OR ";
            }
        }    
        $where = $where.") AND ";

}
else{
    $where = $where."tr.data_stream = ".$streams." AND ";
}


if(is_array($demos)){
    $select = $select.", tr.demo ";
    //$groupby = $groupby.", tr.demo ";

    $len = count($demos) - 1;
    $where = $where."(";
        foreach ($demos as $i => $demo) {
            $where = $where."tr.demo = '".$demo."' ";
            if($i < $len){
                $where = $where."OR ";
            }
        }    
        $where = $where.") AND ";

}
else{
    $where = $where."tr.demo = ".$demos." AND ";
}

if(is_array($metrics)){
    $select = $select.", tr.rating_type ";
    //$groupby = $groupby.", tr.demo ";

    $len = count($metrics) - 1;
    $where = $where."(";
        foreach ($metrics as $i => $metric) {
            $where = $where."tr.rating_type = '".$metric."' ";
            if($i < $len){
                $where = $where."OR ";
            }
        }    
        $where = $where.") AND ";

}
else{
    $where = $where."tr.rating_type = ".$metrics." AND ";
}


$select = $select." FROM telecast_info ti ";
$where = $where."ti.date_time <= '".$starttime."' AND ti.date_time >= DATE_ADD('".$starttime."',INTERVAL -".$weeks." WEEK)) ";
$groupby = "";//" GROUP BY ti.date_time, tr.data_stream";
$orderby = " ORDER BY ti.date_time;";

$qry =  $select." LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time JOIN cleanlist_series cl ON cl.id=ti.seriesId ".$where.$groupby.$orderby;

//echo $qry;

$sth = $db->prepare($qry);
$sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});








//send a parameter that defines the period - ie couold be used to get weekly, monthly, qtrly...
$app->get('/getweeklyratings/', function () {
    $app = \Slim\Slim::getInstance();

    $nets = $app->request->get('net');
    $streams = $app->request->get('stream');
    $metric = $app->request->get('metric');
    $demos = $app->request->get('demo');
    $starttime = $app->request->get('starttime');
    $weeks = $app->request->get('weeks');

    try 
    {       
//SELECT avg(tr.rating_val) as rating_avg, WEEK(tr.date_time,1) as wk, tr.date_time FROM telecast_info ti LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (ti.net = "APL" AND tr.rating_type="aa" AND tr.data_stream="lsd" AND tr.demo = "P25_54") GROUP BY WEEK(tr.date_time,1)        
        $db = getDB();
       // $sth = $db->prepare("SELECT ROUND(SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ), 1) as val FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net='".$net."' AND tr.rating_type='m25_54 skew');");
        
        $roundval = 2;
        if($metric == 'imp'){
            $roundval = 0;
        }



        $select = "SELECT ROUND(AVG(tr.rating_val), ".$roundval.") as rating, WEEK(tr.date_time,1) as wk, tr.date_time";
        

        $where = "WHERE (";

            $groupby = "GROUP BY WEEK(tr.date_time,1)";

            if(is_array($nets)){
                $select = $select.", ti.net ";
                $groupby = $groupby.", ti.net ";

                $len = count($nets) - 1;
                $where = $where."(";
                    foreach ($nets as $i => $net) {
                        $where = $where."ti.net = '".$net."' ";
                        if($i < $len){
                            $where = $where."OR ";
                        }
                    }    
                    $where = $where.") AND ";

}
else{
    $where = $where."ti.net = ".$nets." AND ";
}



if(is_array($streams)){
    $select = $select.", tr.data_stream ";
    $groupby = $groupby.", tr.data_stream ";

    $len = count($streams) - 1;
    $where = $where."(";
        foreach ($streams as $i => $stream) {
            $where = $where."tr.data_stream = '".$stream."' ";
            if($i < $len){
                $where = $where."OR ";
            }
        }    
        $where = $where.") AND ";

}
else{
    $where = $where."tr.data_stream = ".$streams." AND ";
}


if(is_array($demos)){
    $select = $select.", tr.demo ";
    $groupby = $groupby.", tr.demo ";

    $len = count($demos) - 1;
    $where = $where."(";
        foreach ($demos as $i => $demo) {
            $where = $where."tr.demo = '".$demo."' ";
            if($i < $len){
                $where = $where."OR ";
            }
        }    
        $where = $where.") AND ";

}
else{
    $where = $where."tr.demo = ".$demos." AND ";
}


$select = $select." FROM telecast_info ti ";
$where = $where."tr.rating_type='".$metric."' AND ti.date_time <= '".$starttime." 24:00:00' AND ti.date_time >= DATE_ADD('".$starttime."',INTERVAL -".$weeks." WEEK)) ";
$orderby = " ORDER BY ti.date_time;";

$qry =  $select." LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time ".$where.$groupby.$orderby;
       // echo $qry;

$sth = $db->prepare($qry);
$sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});





$app->get('/updateAverages/', function () {
    $app = \Slim\Slim::getInstance();
    //$net = $app->request->get('net');

    try 
    {       

        //select tr.rating_type, SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ) as rating_val, SUM(ti.duration) as duration  FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net="DISC" AND tr.rating_type="m25_54 skew");

        $db = getDB();
        $sth = $db->prepare("SELECT ROUND(SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ), 1) as val FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});




$app->get('/getskew/', function () {
    $app = \Slim\Slim::getInstance();
    $net = $app->request->get('net');

    try 
    {       

        //select tr.rating_type, SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ) as rating_val, SUM(ti.duration) as duration  FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net="DISC" AND tr.rating_type="m25_54 skew");

        $db = getDB();
        $sth = $db->prepare("SELECT ROUND(SUM( tr.rating_val * ti.duration ) / SUM( ti.duration ), 1) as val FROM telecast_info ti  LEFT JOIN telecast_ratings tr ON tr.net = ti.net AND tr.date_time =ti.date_time WHERE (tr.net='".$net."' AND tr.rating_type='m25_54 skew');");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});


$app->get('/getdemos/', function () {
    $app = \Slim\Slim::getInstance();
    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT demo FROM demolist;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});


$app->get('/getweeks/', function () {
    $app = \Slim\Slim::getInstance();
    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT DATE_FORMAT(ti.date_time,'%Y-%m-%d') as date_time from telecast_info as ti GROUP BY WEEK(ti.date_time,1) ORDER BY ti.date_time DESC;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/getnets/', function () {
    $app = \Slim\Slim::getInstance();
    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT net FROM netlist;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/getstreams/', function () {
    $app = \Slim\Slim::getInstance();
    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT data_stream FROM streamlist;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});

$app->get('/getmetrics/', function () {
    $app = \Slim\Slim::getInstance();
    try 
    {   
        $db = getDB();
        $sth = $db->prepare("SELECT rating_type FROM infotypelist;");
        $sth->execute();
        $data = $sth->fetchAll(PDO::FETCH_ASSOC);//(PDO::FETCH_OBJ);

        if($data) {
            $app->response->setStatus(200);
            $app->response()->headers->set('Content-Type', 'application/json');
            echo json_encode(utf8ize($data));
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }            
        
    } catch(PDOException $e) {
        $app->response()->setStatus(404);
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});


$app->run();
// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available
console.log($scope.app);


let viewLoaded = false;
let readComplete = false;


const DEBUG = true;
const UPLOADPATH = "app/resources/Uploaded/";
//let jsontmp = UPLOADPATH + $scope.app.params['activeJSON'];
let jsontmp = $scope.app.params['activeJSON'];

function loadLibrary(src) {
    return new Promise(function (resolve, reject) {
        var head = document.head || document.getElementsByTagName('head')[0],
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'app/resources/' + src;
        head.appendChild(script);
        script.onload = resolve; // Resolve when script is loaded
        script.onerror = reject; // Reject if loading fails
    });
}

loadLibrary('Uploaded/jlogger.js')
    .then(function () {
        $rootScope.logger = new Jlogger("SOWI NGC_sxsl_Player_04", "GLOBAL");
  		// $timout(function () {  .....................................................................SGW fixed
        $timeout(function () {
            $rootScope.logger.setShowOutput(DEBUG);
            $rootScope.logger.output("Logger is initializated and ready", "Start.js - loadLibary");
            //Custom Logger
            //Sample
            // $rootScope.logger.output("Scan is finished, VIN = " + scaninfo, "scanfinshed")
            // $rootScope.logger.output(<message>, <location -OPTIONAl>, <depth -OPTIONAL>)
        }, 1250)
    })
    .catch(function (error) {
        console.error('Error loading library:', error);
    });

loadLibrary('Uploaded/coeSxSLHelper.js')
    .then(function () {
        $rootScope.sxslHelper = new coeSxSLHelper();      //Setup the ImageScaler Class in DEBUG (true) mode, (false or blank = no colored background)
        $rootScope.logger.output("coeSxSLHelper is initializated and ready", "loadLibary");
        fetch(jsontmp)
            .then(response => response.json())
            .then(data => $scope.readComplete(data))
            .catch(function (error) { console.log(' #### JSON Fetch Error #### ', error); });
    })
    .catch(function (error) {
        console.error('Error loading library:', error);
    });

$scope.readComplete = function (data) {
    $rootScope.logger.output("Sending SxSL to Helper", "Start.js - readComplete");
    $rootScope.sxslHelper.setSxSL(data);
    readComplete = true;
    $scope.systemFullyInit();
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Thingworx request function
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$rootScope.thingworxRequest = function (value, params , servicename) {

  let appKey = "80d2567c-d0b2-4b72-8bc6-e021f579485a";
  let workTrackURLprefix  = '/Thingworx/Things/PTCSC.SOWI.WorkTrack.Manager/Services/'
  let URL = workTrackURLprefix + servicename;
  
  try {
    let headers = {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      appKey: appKey
    };
    // Body
    $http.post(URL, params, {
      headers: headers,
    })
      .then(
      function (data) {
        if (data) {
          $rootScope.logger.output('Completed THX request' , JSON.stringify(data));
          return data;
        }
      },
      function (status) {
        $rootScope.logger.output("THX Service " + servicename + " Failure", "Thingworx /PTCSC.SOWI.WorkTrack.Manager/Services/'+ servicename +' service failed!"+ "\n" + "The status returned was:  "+ status + "\n");
        return undefined;
      }
    )
  } catch (e) {
    $rootScope.logger.output("THX Service " + servicename + " Failure", 'Check application key or if server is running or error was ' + e);
    return undefined;
  }

}



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GETUSER NAME from Thingworx session (future updates to SOWI would make sense to it get the username rather than passing something it already knows.
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$rootScope.getUserName = function () {
  
  
  let URL = '/Thingworx/Resources/CurrentSessionInfo/Services/GetCurrentUser';
  try {
    let headers = {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      appKey: appKey
    };
    // Body
    $http.post(URL, {
      headers: headers,
    })
      .then(
      function (data) {
        if (data.data.rows.length > 0) {
          $rootScope.logger.output('Completed THX request' , JSON.stringify(data));
          $scope.app.params.username = data.data.rows[0].result;
        } else {
          
          $rootScope.logger.output("THX Service  GetCurrentUser Failure", 'No user name returned');
        }
      },
      function (status) {
        $rootScope.logger.output("THX Service GetCurrentUser Failure", "Thingworx /Thingworx/Resources/CurrentSessionInfo/Services/GetCurrentUser service failed!"+ "\n" + "The status returned was:  "+ status + "\n");
      }
    )
  } catch (e) {
    $rootScope.logger.output("THX Service  GetCurrentUser Failure", 'Check application key or if server is running or error was ' + e);
  }
  
  
}


// GetWorkOrderStatus
// Returns the status of the work order.

// This service is used to check if the work order is complete or not. 
// If the work order is complete or cancelled, then the Vuforia app should not allow new sessions for the work order.

// Returns infotable:
// Success – returns {<workOrderStatus>, “”}
// Error – returns {“Error”, <explanation>}
getWorkOrderStatus = function (workOrderNumber) {
  
  console.log(">>>> GetWorkOrderStatus: GetWorkOrderStatus");
  
  let appKey = "80d2567c-d0b2-4b72-8bc6-e021f579485a";
  let URL  = '/Thingworx/Things/PTCSC.SOWI.WorkTrack.Manager/Services/GetWorkOrderStatus'
  let params = {
      "workOrderNumber": workOrderNumber 
  };
  try {
    let headers = {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      appKey: appKey
    };
    // Body
    $http.post(URL, {
      headers: headers,
    })
      .then(
      function (data) {
        if (data.data.rows.length > 0) {
          $rootScope.logger.output('Completed THX request' , JSON.stringify(data));
          $scope.app.params.username = data.data.rows[0].result;
          $scope.app.fn.navigate("Home");
        } else {
          
          $scope.app.fn.navigate("Home");
        }
      },
      function (status) {
        $rootScope.logger.output("THX Service GetCurrentUser Failure", "Thingworx /Thingworx/Resources/CurrentSessionInfo/Services/GetCurrentUser service failed!"+ "\n" + "The status returned was:  "+ status + "\n");
      }
    )
  } catch (e) {
    $rootScope.logger.output("THX Service  GetCurrentUser Failure", 'Check application key or if server is running or error was ' + e);
  }
  
}



//This function will execute each time the view is loaded
$scope.$on("$ionicView.loaded", function (event) {
    viewLoaded = true;
    $scope.systemFullyInit();

});


$scope.systemFullyInit = function () {
    if (readComplete && viewLoaded) {
        $rootScope.getUserName();              // Added here maybe a better place - tried on view load but that failed was things had not quite completed 
        $scope.checkForScan();
    }
}

$scope.checkForScan = function () {
    //Here we investigate if the first Step in the SxSL requires a SCAN.  This is a special business case
    //  if we need a scan, we do the scan and capture the work order for use later.
    //  if we do not need a scan the procedure is started.

    $rootScope.logger.output("Checking Step 1 for Special WO Scan", "Start.js - checkForScan")
    let scanneeded = $rootScope.sxslHelper.WOScanNeeded();   //This should be permement

    $rootScope.logger.output("Scan Needed = " + scanneeded, "Start.js - checkForScan")
    if (scanneeded) {
        $rootScope.logger.output("Do Scan here", 2, "Start.js - checkForScan")
        $scope.doScan();
    }
    else {
        $scope.app.fn.navigate("Home");
    }
}

$scope.test = function () {
    //Example of how the sxslHelper can be useful in gettting data.
    x = $rootScope.sxslHelper.getDescription();
    $rootScope.logger.output("Description = " + x, "Start.js - test")
}


$scope.doScan = function () {
    $rootScope.logger.output("About to scan", "Start.js - doScan")
    var docObj = document.querySelector('[widget-id="scan-1"]');   //Get DOM info
    var srvcall = 'app.view["Start"].wdg["scan-1"].svc.startScan'  //Set Syntax of Service call                   
    twx.app.fn.triggerStudioEvent(docObj, srvcall);                 //Trigger Service Call      
    //The below code will not work when navigating from TempStart - It Picks up "TempStart" as View and then cannot find scan-1
    //twx.app.fn.triggerWidgetService("scan-1", "startScan");

}

$scope.scanComplete = function () {
    //
    //This function will execute (if set in JS of widgget) when the scan is complete
    //Once the scan is complete, we use the obtained value which should be the work order number
    //using the work order number we make the TWX service call to check if this is a new or fresh run
    //

    let wonum =  $scope.getWidgetProp('scan-1','scannedValue' ); 
  	$scope.app.params.workordernumber = wonum;
    $rootScope.logger.output("Scan Complete", "Start.js - scanComplete value=" + wonum);

  
    $rootScope.sxslHelper.setWorkOrder(wonum);    // Store the WorkOrder    

    //Make TWX Call and procedure check here
    //Parameters: wonum = Scanned Work Order Number
    //            2     = Start @ step #2 (since Step 1 was scanning a Work Order)
    
  
    getWorkOrderStatus(wonum);
    

  
  	//$scope.startProcedureSession(wonum, 2);
  
  
  
}

$scope.startProcedureSession = function (wo, ss) {
    //
    // This is where the TWX API call should be made.  This is Demo Program so this activity is simulated from the TempStart screen w/ App Parms
    // It's envisioned, that this info can be stored in the sxslHelper
    /*
        PTCSC.SOWI. WorkTrack.Manager.StartProcedureSession(userName, workOrderNumber, procedureId, procedureVersion, procedureTitle, procedureDescription, relatedAsset, relatedProduct, procedureLastEditor, devicePlatform, appVersion, language) 
    
        Starts work session on a procedure for a work order. 
        Checks if the user is authorized to run the procedure. 
        Checks if the procedure was previously started
        
        Returns the infotable with {sessionId,  workOrderProcedureStatus, lastFinishedActionId, message}
        
        Examples:
        Success example – procedure not started yet  - creates a session id - {1234, “started”, “”, “ok”}
        Success example – procedure already started – returns a session id and the last completed action id  {1234,” started”, lastCompletedActionId, “ok”}
        Procedure already finished {““, “finished”, ““, “selected procedure was already completed for this work order”}
        Not Authorized – {““, ““, ““, “not authorized”}
        DB down – {““, ““, ““, “database down”}
    */
    $rootScope.logger.output("Scan Complete", "Start.js - startProcedureSession")
    let resume = ($scope.app.params['resume'] === 'true');
    let resumestep = $scope.app.params['resumestep'];
    $rootScope.logger.output("resume value = " + resume, "Start.js - startProcedureSession", 2)
    $rootScope.logger.output("resume step  = " + resumestep, "Start.js - startProcedureSession", 2)

    //Now we need to check ThingWorx to see if this is a Fresh or New Run    
    if (resume) {
        $rootScope.logger.output("Inside the TRUE part of if", "Start.js - startProcedureSession", 4)
        startStep = $rootScope.sxslHelper.getStepNum(resumestep);
        $rootScope.sxslHelper.setFreshRun(false);
    }
    else {
        $rootScope.logger.output("Inside the FALSE part of if", "Start.js - startProcedureSession", 4)
        startStep = $rootScope.sxslHelper.getStepNum(ss);
    }

    let id = startStep.stepId;

    //This is the code to set the Resume Step.
    $scope.app.params['prevRun'] = [{ "stepId": id, "status": "hold" }]
    $scope.app.fn.navigate("Home");
}
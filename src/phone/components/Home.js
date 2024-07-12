console.log($scope.app);

let coeSxSLHelper;
let sessionSteps = [];
let appKey = "80d2567c-d0b2-4b72-8bc6-e021f579485a";
let workTrackURLprefix  = '/Thingworx/Things/PTCSC.SOWI.WorkTrack.Manager/Services/'


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Local Functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       


thingworxRequest = function (value, params , servicename) {


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
        }
      },
      function (status) {
        $rootScope.logger.output("THX Service " + servicename + " Failure", "Thingworx /PTCSC.SOWI.WorkTrack.Manager/Services/'+ servicename +' service failed!"+ "\n" + "The status returned was:  "+ status + "\n");
      }
    )
  } catch (e) {
    $rootScope.logger.output("THX Service " + servicename + " Failure", 'Check application key or if server is running or error was ' + e);
  }

}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 3 main WorkTrack actions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       


//Marks the end of an action in a wok session
//Success - Returns message “OK” for successful save.
//Error - Returns message “Action save failed - <explanation>”
saveAction = function () {
  
  console.log(">>>> saveAction: started");
  let params = {
      "actionId": actionId , "actionName": actionName ,"actionDescription": actionDescription ,"actionInput": actionInput ,"actionDuration": actionDuration 
  };
  thingworxRequest(value , params , 'saveAction');
  
  
}

// Marks the start of a step of a procedure in a work session.
// Success - Returns message “OK” for successful insert.
// Error - Returns message “Step start failed”
startStep = function () {
  
  console.log(">>>> startStep: started");
  let params = {
      "sessionId": sessionId , "stepId": stepId , "stepTitle": stepTitle , "stepDescription": stepDescription 
  };
  thingworxRequest(value , params , 'startStep');
  
  
}

// Returns the infotable with {sessionId,  workOrderProcedureStatus, lastFinishedActionId, message}
startProcedureSession = function () {
  
  console.log(">>>> startProcedureSession: started");
  let params = {
      "userName": userName,  "workOrderNumber": workOrderNumber,"procedureId": procedureId,"procedureVersion": procedureVersion,"procedureTitle": procedureTitle,"procedureDescription": procedureDescription,"relatedAsset": relatedAsset,"relatedProduct": relatedProduct,"procedureLastEditor": procedureLastEditor,"devicePlatform": devicePlatform,"appVersion": appVersion,"language": language
  };
  thingworxRequest(value , params , 'StartProcedureSession');
  
  
  
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Studio Functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$scope.waitForButton = function (selector) {
    // 
    // This function will monitor for the "next / start" button to become
    // available.  Once available, the result (querySelector) will be returned
    //
    $rootScope.logger.output("Monitoring Selector = " + selector)
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const elm = document.querySelector(selector);
            if (elm) {
                clearInterval(interval);
                resolve(elm);
            }
        }, 100);
    });
}


//

$scope.shoeHideSteps = function () {
  
  let state = $scope.getWidgetProp("popupSteps" , "visible");
  if (state === true) {
    $scope.setWidgetProp("popupSteps" , "visible" , false);
  } else {
    $scope.setWidgetProp("popupSteps" , "visible", true);
  }
  
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       


//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Watches
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Events
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//


$scope.$on('statusLogger', function (evt, value) {
  console.log(">>>> statusLogger:" + value);
  let params = {
      "someinput": value
  };
  thingworxRequest(value , params , 'testrequest');

});



$scope.$on('procEnd', function (evt, procedure) {
    // 
    // Will execute when the Procedure is finshed.
    //
    $rootScope.logger.output("Proc End", "Home.js - procEnd");
    //debugger;

});

$scope.$on('stepEnd', function (evt, step) {
    //
    // Will execute when the Step ends
    //
    $rootScope.logger.output("stepEnd Function: Start", "Home.js - setepEnd");
    //Sample End of Step Processing : Get Executed Step Title
    x = $rootScope.sxslHelper.getStepTitleByID(step.id);
    $rootScope.logger.output("Step Title " + x, "Home.js - setepEnd", 1)

    // Things that may happen at the end of the step:
    //   Get Acknowledgment Type and Respone
    //   Get Step Duration
    //   etc..
    // This could be done by using the passed in "step" argument (or by the sxsl Player "STATUS"??)
  
    // sessionSteps.push = {value : 'pais' , };
    //

});


$scope.$on('actionEnd', function (evt, action) {
    // 
    // Will execute when the Action Ends.
    //
    $rootScope.logger.output("Action End", "Home.js - actionEnd");
    

});

$scope.$on('actionInputDelivered', function (evt, input) {
    // 
    // Will fire when the input from an action has bee captured
    //
    $rootScope.logger.output("Action Input Delievered", "Home.js - actionInputDelivered")
    //$rootScope.logger.output(JSON.stringify(input.action.details.response), "Home.js - actionInputDelivered", 2)

});


$scope.$on("$ionicView.loaded", function (event) {
    //
    // This will execute each time the view is loaded.
    // its a good place to check for initialization.
    // however it does not always indicate that everything is available for use
    //
    viewLoaded = true;
    x = $rootScope.sxslHelper.getDescription();
    $rootScope.logger.output("Description = " + x, "home.js - Loaded");
    var fr = $rootScope.sxslHelper.getFreshRun();
    $rootScope.logger.output("Is this a Fresh Run ? " + fr, "home.js - Loaded");

    if (!fr) {
        //When the sxsl Player becomes available move to the resume step
        $scope.waitForButton("#advance").then((elm) => {
            // if this is NOT a fresh start we want to bypass the 'splash' / 'intro'
            // screen.  This waitfor function will do that and once it is available
            // a click is sent to dismiss it.
            $rootScope.logger.output("Element? " + elm, "home.js - Loaded", 2);
            elm.click(); // Triggers the advance;            
        });
    }

});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       



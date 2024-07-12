// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available

console.log($scope.app);

var jsonlist = [
    {
      "show": "JSON with Work Order Scan 1st",
      "file": "app/resources/Uploaded/sowi.json"
    },
    {
      "show": "Duplicate JSON no Work Order Scan",
      "file": "app/resources/Uploaded/sowi2.json"
    },
    {
      "show": "1 Step - Test Barcode",
      "file": "app/resources/Uploaded/barcodetest.json"
    },
    {
      "show": "1 Step - Test Torque Range",
      "file": "app/resources/Uploaded/torqerange.json"
    }
  ]

//This function will execute each time the view is loaded
$scope.$on("$ionicView.loaded", function (event) {
    $scope.view.wdg['select-1'].list = jsonlist;
    $scope.view.wdg['select-1'].value = "app/resources/Uploaded/sowi.json";
});

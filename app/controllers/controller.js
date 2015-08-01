    var windowHeight;
    var windowWidth;
    var contentHeight;
    var contentWidth;   
    function windowResizeHandler() {
        windowHeight = window.innerHeight;
        contentHeight = windowHeight;
        $('#wrapper').height(contentHeight-70);
        $('#mapView').height(contentHeight-70);
        $('map').height(contentHeight-70);
        $('#content').height(contentHeight-70);

    }







    carApp.controller('loginController',function($scope,$facebook,$modal,$location,getRidesService){
    $scope.loader=true;
    $scope.animationsEnabled = true;
    $scope.isLoggedIn = true;
    $scope.isLoggedOut = false;
    $scope.navbarCollapsed = true;
    
    var userId=sessionStorage.uid;
    var userType=sessionStorage.logType;


    getRidesService.getMessageCount(userId,userType).success(function (responseMessageCount) {

            $scope.messageCount=responseMessageCount.length;
     });


    $scope.myTripTab=function(){
        $location.path('/dashboard');
        $scope.rideOfferTabActive = true;
    }


     if(sessionStorage.logType=="native") {
         getRidesService.getUserDetails(userId).success(function (data) {
             
             $scope.isLoggedIn = false;
             $scope.isLoggedOut = true;
             $scope.profilePic=data[0].profile_picture;
             $scope.welcomeMsg = "Welcome " + data[0].first_name;
             $scope.loginMailId=data[0].email_id;
              $scope.loader=false;
         });
     }else{
         refresh();
          $scope.loader=false;
     }

   
    
    $scope.login = function() {

        $facebook.login().then(function() {
            $scope.loader=true;
            refresh();

        });
    }


    $scope.logout=function(){
        $scope.fStatus = $facebook.isConnected();
        if($scope.fStatus) {
            $facebook.logout().then(function () {
                refresh();
                sessionStorage.clear();
                $location.path('/');
            });
        }else{
            sessionStorage.clear();
            $scope.isLoggedIn = true;
            $scope.isLoggedOut = false;
            $location.path('/');
        }
    }

    function refresh() {
        $facebook.api("/me").then(
            function(response) {
                $scope.profilePic="http://graph.facebook.com/"+response.id+"/picture?type=large";
                $scope.welcomeMsg = "Welcome " + response.name;
                $scope.loginMailId=response.email;
                $scope.isLoggedIn = false;
                $scope.isLoggedOut = true;
                sessionStorage.uid=response.id;
                 sessionStorage.logType = 'facebook';
                $scope.loader=false;
            },
            function(err) {
                //$scope.welcomeMsg = "Please log in";
                $scope.isLoggedOut = false;
                $scope.isLoggedIn = true;
                  sessionStorage.uid="";
                 sessionStorage.logType ="";
                $scope.loader=false;
            });
    }



    $scope.offerRides=function(){
             if(!sessionStorage.length>0) {

                 $facebook.login().then(function() {
                      $facebook.api("/me").then(
                            function(response) {

                                        getRidesService.storeFacebookUser(response).success(function(data){
                                            refresh();
                                    /*         $scope.isLoggedIn = false;
                                                $scope.isLoggedOut = true;
                                                $scope.profilePic = "http://graph.facebook.com/" + response.id + "/picture?type=large";
                                                $scope.welcomeMsg = "Welcome " + response.name;
                                                $scope.loginMailId = response.email;
                                                sessionStorage.uid = response.id;
                                                sessionStorage.logType = 'facebook';*/
                                        });

                                
                                
                                
                               
                            },
                            function(err) {
                               console.log(err);
                            });
                      });

             }else{
                $location.path('/offer-rides');
             }
    };



     $scope.loginFacebook=function(){
    
      $facebook.login().then(function() {
          $facebook.api("/me").then(
                function(response) {

                            getRidesService.storeFacebookUser(response).success(function(data){
                                refresh();
                        /*         $scope.isLoggedIn = false;
                                    $scope.isLoggedOut = true;
                                    $scope.profilePic = "http://graph.facebook.com/" + response.id + "/picture?type=large";
                                    $scope.welcomeMsg = "Welcome " + response.name;
                                    $scope.loginMailId = response.email;
                                    sessionStorage.uid = response.id;
                                    sessionStorage.logType = 'facebook';*/
                            });

                    
                    
                    
                   
                },
                function(err) {
                   console.log(err);
                });
          });
     }


});




  /*  $scope.signUp = function(){      
            var modalInstance = $modal.open({
                templateUrl: 'signUp.html',
                controller: 'ModalInstanceCtrl'
            });
    }; */ 
    
    
    
/*    $scope.openModel = function (size) {
    if(!sessionStorage.length>0) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function (logArray) {

            if (logArray.logStatus) {
                var loginType = logArray.logType;
                if (loginType == "facebook") {
                    $scope.isLoggedIn = false;
                    $scope.isLoggedOut = true;
                    $scope.profilePic = "http://graph.facebook.com/" + logArray.logResponse.id + "/picture?type=large";
                    $scope.welcomeMsg = "Welcome " + logArray.logResponse.name;
                    $scope.loginMailId = logArray.logResponse.email;
                    sessionStorage.uid = logArray.logResponse.id;
                    sessionStorage.logType = 'facebook';

                    getRidesService.storeFacebookUser(logArray).success(function(data){
                        console.log(data);
                    });

                } else {
                                     
                    $scope.isLoggedIn = false;
                    $scope.isLoggedOut = true;
                    $scope.profilePic = logArray.logResponse.pic;
                    $scope.welcomeMsg = "Welcome " + logArray.logResponse.firstname;
                    $scope.loginMailId = logArray.logResponse.email;
                    sessionStorage.uid = logArray.logResponse.userid;
                    sessionStorage.logType = 'native';

                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }else{
        $location.path('/offer-rides');
    }
   

  };*/
    



/*carApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance,$facebook, getRidesService) {
   
    $scope.loginNative = function($dataItms) {    
     getRidesService.nativeLogin($dataItms).success(function(data){
           if(data.error){
               $scope.loginErrorMsg=data.error;
           }else{
               console.log(data);
                $scope.logArray={ logStatus:true, logResponse:data ,logType:"native" }
                $modalInstance.close($scope.logArray);
           }
        });
    } 
    
    $scope.signUpNative = function($dataItms) {    
     getRidesService.nativeSignUp($dataItms).success(function(data){
            if(data.error){
               $scope.signUpErrorMsg=data.error;
           }else{
               $('.signUp-form').css('display','none');
               $scope.signUpSuccessMsg=data.message;               
           }                      
        });               
    }
    
 $scope.loginFacebook=function(){
    
      $facebook.login().then(function() {
      $facebook.api("/me").then(
            function(response) {

                $scope.logArray={
                    logStatus:true,
                    logResponse:response,
                    logType:"facebook"
                };
                
                $modalInstance.close($scope.logArray);
            },
            function(err) {
               $modalInstance.close($scope.loggedStatus=false);
            });
      });
 }

 
});*/

/** Native SignUp controller
 *  signup functionality
 */

//carApp.controller('NativeSignUpCtrl', function ($scope, signUpInstance,getRidesService) {   
//      
// $scope.signUpNative = function($dataItms) {    
//     getRidesService.nativeSignUp($dataItms).success(function(data){
//            $scope.logArray={ logStatus:true, logResponse:data }
//            signUpInstance.close($scope.logArray); 
//            
//        });               
//    }
//
// 
//});

/**home page controller
 * search functionality
 */

carApp.controller('homeController', function($scope,$location) {

    $scope.searchRides=function(){
        var origin=$scope.originPlaceField;
        var destination=$scope.destinationPlaceField;

        $location.path('/search-result/'+origin+'to'+destination);
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

});

/** search result controller
 * gmap height adjustment
 * ride available markers in gmap
 * filter functionality
 */
carApp.controller('searchResultController', function($scope,$location,getRidesService,$routeParams,$facebook) {
   
    
    windowResizeHandler();



    /*$scope.markers = [
        ['Bondi Beach', 12.9700, 77.7500, 4],
        ['Coogee Beach', 12.9441261, 77.60519840, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];*/

    var searchQuery=($routeParams.query).split('to');
    var fromParam=searchQuery[0];
    var toParam=searchQuery[1];
    var splitOrigin=fromParam.split(',')[0];
    var splitDestination=toParam.split(',')[0];
    $scope.originPlace=fromParam;
    $scope.destinationPlace=toParam;
    $scope.loader=true;

    $scope.applyFilter=function(){
        $scope.loader=true;
        var filterData = {
            origin: $scope.originPlace.split(',')[0],
            destination:$scope.destinationPlace.split(',')[0],
            minPrice:$scope.minPrice,
            maxPrice:$scope.maxPrice,
            date:$scope.ridedate
        };

        console.log(filterData);


        getRidesService.filterRides(filterData).success(function(data){
            if(data.length > 0){
                $scope.cards=data;
                $scope.noResultAlert=false;
                $scope.loader=false;
            }else{
                $scope.cards=data;
                $scope.noResultAlert=true;
                $scope.loader=false;
            }

        });

    }



    
 



    getRidesService.getRides(splitOrigin,splitDestination).success(function(data){
        if(data.length > 0){
        for(var i=0;i<data.length;i++){




        }


        console.log($facebook);

        $scope.cards=data;


        var priceArray=[];
        for(var i=0; i<data.length;i++){
                priceArray.push(data[i].price);
        }
       
         $scope.minPrice=Math.min.apply(null, priceArray);
         $scope.maxPrice=Math.max.apply(null, priceArray);
            $scope.noResultAlert=false;
        $scope.loader=false;
        }else{
            $scope.noResultAlert=true;
            $scope.loader=false;
        }
    });





});



/** Ride detail page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('rideDetailController',function($scope,getRidesService,$routeParams,$modal){

    $scope.loader=true;

    $scope.max = 5;
    $scope.isReadonly = true;
    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';



    var rideId=$routeParams.id;
    getRidesService.getRidesDetails(rideId).success(function(data){



        /** get distance and time from google map
         * @type {google.maps.DirectionsService}
         */
        directionsService = new google.maps.DirectionsService()
        var request = {
            origin: data[0].departure,
            destination:data[0].arrival,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                $scope.distance=response.routes[0].legs[0].distance.text;
                $scope.travelTime=response.routes[0].legs[0].duration.text;
            }
        });



        $scope.origin = data[0].departure;
        $scope.destination =data[0].arrival;
        $scope.originPlace= data[0].departure;
        $scope.destinationPlace =data[0].arrival;
        $scope.dep_date =data[0].departure_date;
        $scope.dep_time =data[0].departure_time;
        $scope.price =data[0].price;
        $scope.seats =data[0].seats;
        $scope.car_model ="Ford endovure";
        $scope.distance ="200";
        $scope.future_detail =data[0].further_details;
        $scope.detour =data[0].detour;
        $scope.leave =data[0].leave;
        $scope.luggage =data[0].luggage_size;
        $scope.user_type=data[0].user_type;
        $scope.userId=data[0].userid;

        if($scope.user_type=="facebook"){
            getRidesService.getUserDetails(data[0].userid,$scope.user_type).success(function (data) {
                console.log(data);
                $scope.userName=data[0].first_name;
                $scope.profilePicture="http://graph.facebook.com/" + data[0].social_id + "/picture?type=large";
                var birthYear=data[0].birth_year;
                var d = new Date();
                var n = d.getFullYear();
                $scope.age=n-birthYear;
                $scope.rate = data[0].rating;
                $scope.createdDate=data[0].created_date;
                $scope.mobileNumber=data[0].mobile_number;
                if(data[0].mobile_verified==0){
                    $scope.mobileVerifiedStatus="notVerified";
                    $scope.mobileVerifiedMsg='Phone number not verified';
                }else{
                    $scope.mobileVerifiedStatus="verified";
                    $scope.mobileVerifiedMsg="Phone number verified";
                }
                if(data[0].email_verified==0){
                    $scope.emailVerifiedStatus="notVerified";
                    $scope.emailVerifiedMsg='Email address not verified';
                }else{
                    $scope.emailVerifiedStatus="verified";
                    $scope.emailVerifiedMsg="Email address verified";
                }
                $scope.loader=false;
            });

        }else{
            getRidesService.getUserDetails(data[0].userid,$scope.user_type).success(function (data) {
                $scope.profilePicture=data[0].profile_picture;
                $scope.userName=data[0].first_name;

                var birthYear=data[0].birth_year;
                var d = new Date();
                var n = d.getFullYear();
                $scope.age=n-birthYear;
                $scope.rate = data[0].rating;
                $scope.createdDate=data[0].created_date;
                $scope.mobileNumber=data[0].mobile_number;
                if(data[0].mobile_verified==0){
                    $scope.mobileVerifiedStatus="notVerified";
                    $scope.mobileVerifiedMsg='Phone number not verified';
                }else{
                    $scope.mobileVerifiedStatus="verified";
                    $scope.mobileVerifiedMsg="Phone number verified";
                }
                if(data[0].email_verified==0){
                    $scope.emailVerifiedStatus="notVerified";
                    $scope.emailVerifiedMsg='Email address not verified';
                }else{
                    $scope.emailVerifiedStatus="verified";
                    $scope.emailVerifiedMsg="Email address verified";
                }
                $scope.loader=false;
            });


        }
    });

    //contactDriver controller
    $scope.contactDriver=function(){
        if(!sessionStorage.length>0) {
               $scope.openModel();
        }else{
            console.log($scope);
            $scope.driverDetails = [{'diverName':$scope.userName,'driverNumber':$scope.mobileNumber,'driverId':$scope.userId}];

            var modalInstance  = $modal.open({
                templateUrl: 'contactDriverModal.html',
                controller: 'contactDriverModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.driverDetails;
                    }
                }
            });
        }
    }

});

    /**contact driver modal controller
     */
carApp.controller('contactDriverModalInstanceCtrl', function ($scope, $modalInstance , getRidesService,items) {
    $scope.isCollapsed = true;
    $scope.driverName=items[0].diverName;
    $scope.driverMobileNumber=items[0].driverNumber;
    var uid=sessionStorage.uid;
    $scope.sendMessageDriver=function(contactDriver){
        if(uid==items[0].driverId){
            alert('same');
        }else {
            getRidesService.sendMessage(uid, items[0].driverId, contactDriver.message).success(function (responseData) {

            });
        }
    }
});


    /**edit rides page controller
     * gmap height adjustment
     * gmap direction service
     */
carApp.controller('editRideDetailController',function($scope,getRidesService,$routeParams) {

    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';
    $scope.rideChange=function(){
        $scope.origin =  $scope.ride.departure;
        $scope.destination = $scope.ride.arrival;
        $scope.departurePlace=$scope.ride.departure;
        $scope.arrivalPlace=$scope.ride.arriva;
        $scope.displayPath=true;
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.mytime = new Date();
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.hstep = 1;
    $scope.mstep = 5;
    $scope.ismeridian = true;



    var rideId=$routeParams.id;

    getRidesService.getRideById(rideId).success(function (data) {
          $scope.ride=data[0];
            $scope.origin =  data[0].departure;
            $scope.destination = data[0].arrival;
            $scope.departurePlace=data[0].departure;
            $scope.arrivalPlace=data[0].arrival;
            $scope.displayPath=true;

    });


    $scope.updateOffer=function(ride) {
        getRidesService.updateRideById(rideId, ride).success(function (response) {
            console.log(response);

        });
    }

});




/**Offer rides page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('offerRidesController',function($scope,getRidesService,$modal){
   
    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';
    $scope.rideChange=function(){
        $scope.origin =  $scope.ride.departureField;
        $scope.destination = $scope.ride.arrivalField;
        $scope.departurePlace=$scope.ride.departureField;
        $scope.arrivalPlace=$scope.ride.arrivalField;
        $scope.displayPath=true;
    }
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    
    $scope.mytime = new Date();
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.hstep = 1;
    $scope.mstep = 5;
    $scope.ismeridian = true;




    /*** save offer function ***/
    $scope.publishOffer=function($dataItms){
        var uid=sessionStorage.uid;
        var userType=sessionStorage.logType;
        var data=$dataItms;
        data.userid=uid;
        data.userType=sessionStorage.logType;

        getRidesService.getUserDetails(data.userid,data.userType).success(function (dataStatus) {
               if(dataStatus[0].mobile_verified==0){

                   var modalInstance = $modal.open({
                       animation: $scope.animationsEnabled,
                       templateUrl: 'mobileVerifyModal.html',
                       controller: 'mobileVerifyModalInstanceCtrl'
                   });

                   modalInstance.result.then(function (number) {
                       var randomNumber=Math.floor(Math.random()*9000) + 1000;

                       getRidesService.storeMobileData(uid,userType,number,randomNumber).success(function (dataQuery) {


                        console.log(dataQuery);
                           var dataItem = {
                               id: uid,
                               userType:userType,
                               mobileNumber:number
                           };
                           var modalInstance2 = $modal.open({
                               animation: $scope.animationsEnabled,
                               templateUrl: 'mobileNumberConfirmContent.html',
                               controller: 'mobileConfirmModalInstanceCtrl',
                               resolve: {
                                   items: function () {
                                       return dataItem;
                                   }
                               }
                           });


                           modalInstance2.result.then(function (status) {
                                    if(status===true){
                                        getRidesService.postOffers(data).success(function(responseData){
                                            var modalInstance = $modal.open({
                                                animation: $scope.animationsEnabled,
                                                templateUrl: 'publishofferSuccessContent.html',
                                                backdrop: 'static', /*  this prevent user interaction with the background  */
                                                keyboard: false,
                                                controller: 'publishOfferModalInstanceCtrl',
                                                resolve: {
                                                    rideId: function () {
                                                        return responseData;
                                                    }
                                                }
                                            });
                                        });
                                    }
                           });
                       });





                   }, function () {
                       $log.info('Modal dismissed at: ' + new Date());
                   });

               }else{
                   getRidesService.postOffers(data).success(function(response){
                       var modalInstance = $modal.open({
                           animation: $scope.animationsEnabled,
                           templateUrl: 'publishofferSuccessContent.html',
                           backdrop: 'static', /*  this prevent user interaction with the background  */
                           keyboard: false,
                           controller: 'publishOfferModalInstanceCtrl',
                           resolve: {
                               rideId: function () {
                                   return response;
                               }
                           }
                       });
                   });
               }
        });



    }
});

    carApp.controller('publishOfferModalInstanceCtrl', function ($scope, $modalInstance, rideId  , $location) {
        $scope.viewRideOffer = function () {
            $modalInstance.close();
            $location.path('/ride-detail/'+rideId);
        };
    });

    carApp.controller('mobileConfirmModalInstanceCtrl', function ($scope, $modalInstance, items, $location,getRidesService) {

        $scope.mobileNumber=items.mobileNumber;
        $scope.confirmMobile=function(){

            getRidesService.confirmMobileCode(items.id,items.userType,$scope.mobileNumber,$scope.confirmCode).success(function (data) {
                if(data.length==0){
                    $scope.mobileCodeError=true;
                }else{
                    $modalInstance.close(data);
                }
                
            });

        }
    });

    carApp.controller('mobileVerifyModalInstanceCtrl', function ($scope, $modalInstance , $location) {

        $scope.verifyMobileNumber=function(){
            $modalInstance.close($scope.mobileNumber);

        }

    });







/**Offer rides page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('dashboardController',function($scope,getRidesService,$modal){

    var userId=sessionStorage.uid;
    var userType=sessionStorage.logType;
    $scope.addCarFormContainer=true;



    getRidesService.getMessageDetail(userId,userType).success(function (responseMessage) {
           $scope.messages=responseMessage;
           $scope.messageCount=responseMessage.length;
    });





    getRidesService.getUserDetails(userId,userType).success(function (data) {
         $scope.userDetail=data;
        if($scope.userDetail[0].mobile_verified==0){
            $scope.mobile_not_verify=true;
        }else{
             $scope.mobile_verify=true;
        }
         if($scope.userDetail[0].email_verified==0){
            $scope.email_not_verify=true;
        }else{
            $scope.email_verify=true;
        }
    });
    
    $scope.saveCar=function(car){
        car.userID=userId;
       getRidesService.saveCar(car).success(function (data){
           console.log(data);
           if(data){
               $scope.carPicUploadContainer=true;
               $scope.addCarFormContainer=false;
           }
       });
    }
    
    $scope.editCar=function(){
         $scope.showAddCar=true;
        $scope.showCarDetail=false;
    }
    
  getRidesService.getUserCarDetails(userId).success(function (data) {
      $scope.carDetails=data;
      if($scope.carDetails.length==0){
          $scope.showAddCar=true;
          $scope.addCarContainer=true;

      }else{
$scope.showCarDetail=true;
          $scope.carDetailContainer=true;
          $scope.showAddCar=false;

      }
      
  });










  getRidesService.getRidesByUser(userId).success(function (data) {

      //$scope.ridesOffered=data;
      $scope.totalItems = data.length;
      $scope.numPerPage = 1;
      $scope.noOfPages = Math.ceil(data.length / $scope.numPerPage);
      $scope.currentPage = 1;

      console.log( $scope.totalItems);


      $scope.setPage = function () {
          $scope.ridesOffered=data.slice( ($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage );
      };

      $scope.pageChanged = function() {
          $log.log('Page changed to: ' + $scope.currentPage);
      };

      $scope.$watch( 'currentPage', $scope.setPage );


      if(data.length==0){
          $scope.noRidesHolder=true;
      }else{
          $scope.ridesDisplay=true;
      }
  });


    /**
     * get car detail make and model
     */
    
    getRidesService.getCarDetails().success(function (data) {
         var i,j=0,k=0, carmodels =[];
        for(i=0;i<data.length;i++){
            j = data[i].MakeID;
            var newArr=[];
            if(j!=k){
                newArr['makeid'] =data[i].MakeID;
                newArr['makename'] =data[i].MakeName;
                carmodels.push(newArr);
            }
            k = j;
        }      
        carmodels.sort(function(a, b){
            return ((a.makename < b.makename) ? -1 : ((a.makename > b.makename) ? 1 : 0));
        });
        $scope.carAllMakes = carmodels;
        
        
     
        
  $scope.getMakeData = function(make){

      console.log(make);
      
      var i,j=0, carmodels =[];
      
        for(i=0;i<data.length;i++){
            j = data[i].MakeID;
            var newArr=[];
            if(j==make){
                newArr['modelid'] =data[i].ModelID;
                newArr['modelname'] =data[i].ModelName;
                carmodels.push(newArr);
            }        
        }      
        carmodels.sort(function(a, b){
            return ((a.modelname < b.modelname) ? -1 : ((a.modelname > b.modelname) ? 1 : 0));
        });
console.log( make);

        $scope.carAllModels =  carmodels;
       
    };   
        
        
    });


    /*** delete car ***/
    $scope.deleteCar=function(id){

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'carDeleteConfirmationModal.html',
            controller: 'carModalDeleteCtrl',

            resolve: {
                items: function () {
                    return id;
                }
            }
        });

        modalInstance.result.then(function (status) {
          if(status){
              getRidesService.deleteCar(userId,id).success(function (data) {
                  if(data){
                      $scope.showAddCar=true;
                      $scope.addCarContainer=true;
                      $scope.carDetailContainer=false;
                  }
              });
          }
        });


    }




    /**
     * Dashboard delete ride controller
     */
    $scope.ridesDisplay=true;
  $scope.deleteRide=function(id){
      $scope.animationsEnabled=true;
      var rideId=id;
          var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'confirmationModal.html',
              controller: 'ModalInstanceDelete',

              resolve: {
                  items: function () {
                      return rideId;
                  }
              }
          });

      modalInstance.result.then(function (status) {
         if(status){
             var index = -1;
             var comArr = eval( $scope.ridesOffered );
             for( var i = 0; i < comArr.length; i++ ) {
                 if( comArr[i].id === id ) {
                     index = i;
                     break;
                 }
             }
             if( index === -1 ) {
                 alert( "Something gone wrong" );
             }
             $scope.ridesOffered.splice( index, 1 );
             if($scope.ridesOffered.length==0){
                 $scope.noRidesHolder=true;
             }else{
                 $scope.ridesDisplay=true;
             }

             getRidesService.deleteRideDb(userId,id).success(function (data) {
                 console.log(data);
             });



         }
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
  }


});
    /**
     * Dashboard car delete popup modal instance controller
     */
    carApp.controller('carModalDeleteCtrl', function ($scope,$modalInstance, items) {
        $scope.delete=function(){
            $modalInstance.close(true);
        }

    });

    /**
     * Dashboard ride delete popup modal instance controller
     */
    carApp.controller('ModalInstanceDelete', function ($scope, $modalInstance, items) {
        $scope.delete=function(){
            $modalInstance.close(true);
        }

    });



    /*** file upload ***/
    carApp.controller('carPicUploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
        $scope.successUpload=false;
    });
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'http://sharerides.in/api/index.php/services/uploadCarPic',
                    fields: {'userid': sessionStorage.uid},
                    file: file
                }).progress(function (evt) {
                    $scope.progressContainer=true;
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                   $scope.dynamic=progressPercentage;

                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $scope.successUpload=true;
                    //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);

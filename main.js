/**
 * Created by ssilvestri on 12/5/15.
 */

var DEALS_API_URL = "https://nutanix.0x10.info/api/deals?type=json&query=list_deals";
var API_HITS_URL = "https://nutanix.0x10.info/api/deals?type=json&query=api_hits";
var localStorageEnabled = typeof(Storage) !== "undefined";

(function(){
    var WebFontConfig = {
        google: {families: ['Raleway:400,700:latin']}
    };
    (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();
})();

(function(angular){
    "use strict";

    var app = angular.module("DealsApp", ['ui.bootstrap']);

    app.controller("DealsController", ['$http', '$scope', '$uibModal', '$log', function($http, $scope, $uibModal, $log){

        $scope.deals = [];
        $scope.animationsEnabled = true;

        $scope.fillStar = function(index, rating){
            return (index <= rating) ? 'filled' : '';
        };

        $http.get(DEALS_API_URL).success(function(data){
            $scope.deals = data.deals;

            console.log($scope.deals);

            angular.forEach($scope.deals, function(value, key){
                var deal = $scope.deals[key];
                var price = value.actual_price;
                var discount = parseFloat(value.discount) / 100.0;
                deal.final_price = (price - (price * discount)).toFixed(2);

                //Check for previous likes from this browser in local storage
                if(localStorageEnabled){
                    var likes = Number(localStorage.getItem(String(deal.name)));
                    if(likes){
                        deal.likes = likes;
                        deal.liked = "true";
                    }
                }
            });
        });

        $http.get(API_HITS_URL).success(function(data){
            $scope.apiHits = data.api_hits;
        });

        $scope.like = function(deal){
            if(deal.hasOwnProperty('likes')){
                if(!deal.hasOwnProperty('liked')){
                    deal.likes++;
                }
            }else{
                deal.likes = 1;
                deal.liked = 'true';
                localStorage.setItem(deal.name, deal.likes);
            }
        };

        $scope.open = function(deal){
            console.log(deal);
            var modalInstance = $uibModal.open({
                animation : $scope.animationsEnabled,
                templateUrl : 'modalContent.html',
                controller : 'ModalInstanceCtrl',
                resolve : {
                    deal : function(){
                        return deal;
                    }
                }
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }]);

    app.controller("ModalInstanceCtrl", ['$scope', '$uibModalInstance', 'deal', function($scope, $uibModalInstance, deal){
        $scope.deal = deal;

        $scope.ok = function(){
            console.log('test');
            $uibModalInstance.close();
        };
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);

})(window.angular);
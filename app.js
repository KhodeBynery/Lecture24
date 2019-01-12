(function () {
'use strict';

angular.module('ShoppingListPromiseApp', [])
.controller('ShoppingListController', ShoppingListController)
.service('ShoppingListService', ShoppingListService)
.service('WeightLossFilterService', WeightLossFilterService);

ShoppingListController.$inject = ['ShoppingListService'];
function ShoppingListController(ShoppingListService) {
  var list = this;

  list.items = ShoppingListService.getItems();

  list.itemName = "";
  list.itemQuantity = "";

  list.addItem = function () {
    ShoppingListService.addItem(list.itemName, list.itemQuantity);
  };

  list.removeItem = function (itemIndex) {
    ShoppingListService.removeItem(itemIndex);
  };
}


ShoppingListService.$inject = ['$q', 'WeightLossFilterService'];
function ShoppingListService($q, WeightLossFilterService) {
  var service = this;

  // List of shopping items
  var items = [];

  // service.addItem = function (name, quantity) {
  //   // Check to see if something is allowed on the shopping list
  //   var promise = WeightLossFilterService.checkName(name);
  //
  //   promise.then(function (response) {
  //     // Check to see if the quantity is acceptable
  //     var nextPromise = WeightLossFilterService.checkQuantity(quantity);
  //
  //     nextPromise.then(function (result) {
  //       var item = {
  //         name: name,
  //         quantity: quantity
  //       };
  //       items.push(item);
  //       // In case the preceding promise fails
  //     }, function (errorResponse) {
  //       console.log(errorResponse.message);
  //     });
  //     // If the outer promise fails
  //   }, function (errorResponse) {
  //     console.log(errorResponse.message);
  //   });
  // };


  // service.addItem = function (name, quantity) {
  //   var promise = WeightLossFilterService.checkName(name);
  //
  //   promise
  //   .then(function (response) {
  //     return WeightLossFilterService.checkQuantity(quantity);
  //   })
  //   .then(function (response) {
  //     var item = {
  //       name: name,
  //       quantity: quantity
  //     };
  //     items.push(item);
  //   })
  //   // When defer.reject gets invoked
  //   .catch(function (errorResponse) {
  //     console.log(errorResponse.message);
  //   });
  // };


  service.addItem = function (name, quantity) {
    var namePromise = WeightLossFilterService.checkName(name);
    var quantityPromise = WeightLossFilterService.checkQuantity(quantity);

    $q.all([namePromise, quantityPromise]). // multiple promises
    then(function (response) {
      var item = {
        name: name,
        quantity: quantity
      };
      items.push(item);
    })
    .catch(function (errorResponse) {
      console.log(errorResponse.message);
    });
  };

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

  service.getItems = function () {
    return items;
  };
}


WeightLossFilterService.$inject = ['$q', '$timeout'];
function WeightLossFilterService($q, $timeout) {
  var service = this;

  service.checkName = function (name) {
    var deferred = $q.defer();

    var result = {
      message: ""
    };
    // Simulate the asynchronous behavior
    $timeout(function () {
      // Check for cookies
      if (name.toLowerCase().indexOf('cookie') === -1) {
        // If the cookie does not appear
        deferred.resolve(result)
      }
      else {
        result.message = "Stay away from cookies, Yaakov!";
        // If the result is rejected by the promise; "breaks the promise"
        deferred.reject(result);
      }
    }, 3000);

    return deferred.promise;
  };


  service.checkQuantity = function (quantity) {
    var deferred = $q.defer();
    var result = {
      message: ""
    };

    $timeout(function () {
      // Check for too many boxes
      if (quantity < 6) {
        deferred.resolve(result);
      }
      else {
        result.message = "That's too much, Yaakov!";
        deferred.reject(result);
      }
    }, 1000);

    return deferred.promise;
  };
}

})();

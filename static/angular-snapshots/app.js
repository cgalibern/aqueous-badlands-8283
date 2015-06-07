 (function(){
	var app = angular.module('snapshotApp', []);
 	app.controller('SnapshotController', [ '$http', function($http) {
    var snapshotC = this;
    //snapshotC.snapshots_url = "http://localhost:3000/snapshots"
    //snapshotC.snapshots_url = "http://192.168.0.5:3000/snapshots"
    snapshotC.snapshots_url = "../snapshots/"
    snapshotC.snapshots = [];
    snapshotC.snapshot_size = 0;
    snapshotC.showform = false;
    snapshotC.navtab = 1;

    snapshotC.reload = function() {
      $http.get(snapshotC.snapshots_url).success( function(data) {
        snapshotC.snapshots = data.map(function(s) {
            snapa=s.split(':');
            return {dbserver:snapa[0], dbname:snapa[1]}
          });
          snapshotC.snapshot_size = snapshotC.snapshots.length;
      	});
    };

    snapshotC.reload();

    snapshotC.addSnapshot = function() {
      $http.post(snapshotC.snapshots_url, {dbserver:snapshotC.formDbserver, dbname: snapshotC.formDbname})
        .success(function(data, status, headers, config) {
          snapshotC.snapshots.push(data);
          snapshotC.snapshot_size++;
          console.log("successfully posted snapshot, id=" + data.id);
          snapshotC.toogleForm();
        })
        .error(function(data, status, headers, config) { console.log("fail to create snapshot") });

      snapshotC.resetFormVars();
    };

    snapshotC.delete = function(dbserver, dbname) {
      $http.delete(snapshotC.snapshots_url + "/" + dbserver +":"+ dbname)
        .success(function (data, status, headers, config) {
          snapshotC.snapshots = snapshotC.snapshots.filter(function (e){
            return e.dbserver !== dbserver && e.dbname != dbname;
          });
          snapshotC.snapshot_size--;
        })
        .error(function(data, status, headers, config) {
          console.log("fail to delete snaphot status:" + status)
        });
    };

    snapshotC.resetFormVars = function() {
      snapshotC.formDbserver = '';
      snapshotC.formDbname = '';
    };

    snapshotC.toogleForm = function() {
      snapshotC.showform = snapshotC.showform ? false : true;
      snapshotC.showform && snapshotC.resetFormVars();
    };

    snapshotC.selectTab = function(setTab) {
      snapshotC.navtab = setTab;
      };
    snapshotC.isSelected = function(checkTab) {
        return snapshotC.navtab === checkTab;
      };

    }]);

 	app.directive('snapshotShow', function() {
 		return {
 			restrict: 'E',
 			templateUrl: 'snapshot-show.html'
 		}
 	});

  app.directive('snapshotList', function() {
 		return {
 			restrict: 'E',
 			templateUrl: 'snapshot-list.html'
 		}
 	});

  app.directive('snapshotForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'snapshot-form.html'
    }
  });

  app.directive('snapshotNav', function() {
    return {
      restrict: 'E',
      templateUrl: 'snapshot-nav.html'
    }
  });

})();

/*	
	This file is part of JUCI (https://github.com/mkschreder/juci.git)

	Copyright (c) 2015 Martin K. Schröder <mkschreder.uk@gmail.com>

	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
*/ 

JUCI.app
.controller("InternetPortMappingPageCtrl", function($scope, $uci, $rpc){
	function reload(){
		$uci.$sync("firewall").done(function(){
			$scope.redirects = $uci.firewall["@redirect"];
			$scope.$apply(); 
		}); 
	} reload(); 
	
	$scope.onAddRule = function(net){
		$uci.firewall.$create({
			".type": "redirect", 
			"src": "wan", 
			"dest": "lan", 
			"target": "DNAT"
		}).done(function(section){
			$scope.rule = section; 
			$scope.rule[".new"] = true; 
			//$scope.rule[".edit"] = true; 
			$scope.$apply(); 
		}); 
	};
	
	$scope.onEditRule = function(rule){
		$scope.rule = rule; 
		console.log(Object.keys($scope.redirects).map(function(k) { return $scope.redirects[k][".name"]; })); 
	};
	
	$scope.onDeleteRule = function(rule){
		rule.$delete().done(function(){
			$scope.$apply(); 
		}); 
	};
	
	$scope.onAcceptEdit = function(){
		$scope.errors = $scope.rule.$getErrors(); 
		if($scope.errors.length) return; 
		$scope.rule[".new"] = false; 
		$scope.rule = null;  
	};
	
	$scope.onCancelEdit = function(){
		if($scope.rule[".new"]){
			$scope.rule.$delete().done(function(){
				$scope.rule = null; 
				$scope.$apply(); 
			}); 
		} else {
			$scope.rule = null; 
		}
	}
}); 

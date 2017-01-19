(function () {
  'use strict';

  angular.module('BlurAdmin.pages.government')
  .controller('alreadyApproveCtrl', alreadyApproveCtrl);

  /** @ngInject */
  function alreadyApproveCtrl($scope, $http, toastr, $filter) {

    var getCertsApi = "http://localhost:3003/certs";
    $scope.approveList = [];
    $scope.idList = [];
    $scope.array = [];
    $scope.limit = 5;
    $scope.offset = 0;
    $scope.Parameters = '';
    $scope.rowCount = 10;
    
    $scope.filters = {
      "startDate": "",
      "endDate": "",
      "companyName": ""
    };  

    //设置查询条件格式
   $scope.newFilters =encodeURIComponent('{companyName: {$regex: #},_created:{$gte:#},_created:{$lte:#},status:#}');
    console.log($scope.newFilters);
    //每页数据的查询条件
    $scope.Parameters={
      "limit": $scope.limit,
      "offset": $scope.offset
    };
    
    //设置查询条件的参数值并encode
    $scope.newParameters = "\' \'"+"\' \'"+ "\' \'"+ 1;
    $scope.newParame = encodeURI($scope.newParameters);

    //获取第一页的数据
    $http.get(getCertsApi+'?filters='+ $scope.newFilters +'&params=' + $scope.newParame,{params:$scope.Parameters})
    .success(function(data,status,headers){
      $scope.alreadyPageData =data;
        /*    $scope.rowCount = headers('X-Total-Count');*/
      $scope.pageSize = 5;
      $scope.selPage = 1;
      $scope.cutPage(); 
    }).error(function(data){
      toastr.error('获取数据失败', '', {});
          console.log("error: ", data);
    });

    //分页
    $scope.cutPage = function(){
      $scope.pages = Math.ceil($scope.rowCount / $scope.pageSize);//分页数
      console.log($scope.pages);
      $scope.newPages = $scope.pages >5?5:$scope.pages;
      $scope.pageList = [];
      for(var i=0;i<$scope.newPages;i++){
        $scope.pageList.push(i+1);
      }
    },

    //设置分页的表格数据源
    $scope.setData = function(){
    //通过当前页数筛选出表格当前显示数据
      $scope.offset = ($scope.selPage - 1) * $scope.limit;
      $scope.Parameters.offset = $scope.offset;
      $http.get(getCertsApi+'?filters='+ $scope.newFilters +'&params=' + $scope.newParame,{params:$scope.Parameters})
    .success(function(data,status,headers){
      $scope.alreadyPageData =data;
        /*    $scope.rowCount = headers('X-Total-Count');*/
      }).error(function(data){
        toastr.error('录入失败', '', {});
          console.log("error: ", data);
      });
    },

    //打印当前选中页索引
    $scope.selectPage = function (page){
    //不能小于1大于最大
      if(page<1 || page>$scope.pages)return;
    //最多显示分页数5
      if(page>2){
    //因为只显示5个页数，大于2页就开始分页转换
      var newpageList = [];
      for(var i=(page - 3);i<((page + 2)>$scope.pages?$scope.pages:(page+2));i++){
      newpageList.push(i + 1);
      }
      $scope.pageList = newpageList;
      }
      $scope.selPage = page;
      $scope.setData();
      $scope.isActivePage(page);
      $scope.select_all = false;
      console.log("选择的页:" + page);
    },

    //设置当前选中页样式
    $scope.isActivePage = function(page){
      return $scope.selPage == page;
    },
    
    //上一页
    $scope.Previous = function(){
      $scope.selectPage($scope.selPage-1);
    },
    
    //下一页
    $scope.Next = function(){
      $scope.selectPage($scope.selPage + 1);
    },

    $scope.checked = [];

    //查询
    $scope.search = function(){ 
      $scope.selectComp = '';
      $scope.selectComp =   "'.*" + $scope.filters.companyName + ".*'" +"," + "\'" 
                           + $filter('date')($scope.filters.startDate,'yyyy-MM-dd') + "\'"
                           +","+ "\'" + $filter('date')($scope.filters.endDate,'yyyy-MM-dd') + "\'";
      $scope.newParams = encodeURI($scope.selectComp);
      console.log($scope.newParams);
      $http.get(getCertsApi+'?filters='+ $scope.newFilters+ '&params='+$scope.newParams,{params:$scope.Parameters})
      .success(function(data,status,headers){
        $scope.alreadyPageData = data; 
          /*    $scope.rowCount = headers('X-Total-Count');*/
        cutPage();
      }).error(function(){
        toastr.error('查询数据失败', '', {});
          console.log("error: ", data);
      });
    };



}

})();


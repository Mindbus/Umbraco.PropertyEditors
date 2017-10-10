function mindbusPriceIntervalController($scope, $log) {

    function PriceInterval(price, beginDate, endDate) {
        return {
            price: price || 0,

            beginDate : {
                editor: "Umbraco.DateTime",
                alias: "datepicker",
                view: 'datepicker',
                validation: {
                    mandatory: true
                },
                config: {
                    pickDate: true,
                    pickTime: true,
                    useSeconds: false,
                    format: "YYYY-MM-DD HH:mm",
                    icons: {
                        time: "icon-time",
                        date: "icon-calendar",
                        up: "icon-chevron-up",
                        down: "icon-chevron-down"
                    }
                }, value: beginDate
            },

            endDate : {
                editor: "Umbraco.DateTime",
                alias: "datepicker",
                view: 'datepicker',
                config: {
                    pickDate: true,
                    pickTime: true,
                    useSeconds: false,
                    format: "YYYY-MM-DD HH:mm",
                    icons: {
                        time: "icon-time",
                        date: "icon-calendar",
                        up: "icon-chevron-up",
                        down: "icon-chevron-down"
                    }
                }, value: endDate
            }
        }
    }

    function init() {
        $log.debug('mindbusPriceIntervalController');
    }

    $scope.addItem = function () {
        if (!$scope.model.value) {
            $scope.model.value = [];
            $scope.addItem();
        } else {
            var valid = true;
            angular.forEach($scope.model.value, function (priceInterval) {
                if (!$scope.isPriceIntervallValid(priceInterval)) {
                    valid = false;
                }
            });
            if (valid) {
                $scope.model.value.push(new PriceInterval(0));
            }
        }
    }

    $scope.isPriceIntervallValid = function (priceInterval) {
        return priceInterval.price >= 0
            && priceInterval.beginDate.value != null
            && (priceInterval.endDate == null
                || priceInterval.endDate.value >= priceInterval.beginDate.value);
    }

    $scope.removeItem = function (index) {
        $scope.model.value.splice(index, 1);
    }

    init();
}
angular.module("umbraco").controller("Mindbus.PriceIntervalController", mindbusPriceIntervalController);
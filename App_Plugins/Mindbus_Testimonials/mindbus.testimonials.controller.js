function mindbusTestimonialsController($scope, $log) {

    function Testimonial(quote, author) {
        return {
            quote: quote || "",
            author: author || ""
        }
    }

    function init() {
        $log.debug('mindbusTestimonialsController');
    }

    $scope.addItem = function () {
        if (!$scope.model.value) {
            $scope.model.value = [];
            $scope.addItem();
        } else {
            var valid = true;
            angular.forEach($scope.model.value, function (testimonial) {
                if (!$scope.isTestimonialValid(testimonial)) {
                    valid = false;
                }
            });
            if (valid) {
                $scope.model.value.push(new Testimonial());
            }
        }
    }

    $scope.isTestimonialValid = function(testimonial) {
        return testimonial.quote && testimonial.author;
    }

    $scope.removeItem = function (testimonialIndex) {
        $scope.model.value.splice(testimonialIndex, 1);
    }

    init();
}
angular.module("umbraco").controller("Mindbus.TestimonialsController", mindbusTestimonialsController);
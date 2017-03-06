function mindbusSlideShowController($scope, $log, dialogService, entityResource, contentResource) {

    function Slide(title, subTitle, description, link, buttonLabel, mediaId, openInNewWindow) {
        return {
            title: title || "",
            subTitle: subTitle || "",
            description: description || "",
            buttonLabel: buttonLabel || "",
            link: link || "",
            mediaId: mediaId || "",
            openInNewWindow: openInNewWindow || false
        }
    }

    function init() {
        $scope.slideList = { slides: $scope.model.value || [] };
        $log.debug("saved slides :", $scope.slideList);
    }


    $scope.$watch("slideList", function (oldVal, newVal) {
        $scope.model.value = [];
        angular.forEach($scope.slideList.slides, function (slide) {
            if ($scope.isSlideValid(slide)) {
                $scope.model.value.push(new Slide(slide.title, slide.subTitle, slide.description, slide.link, slide.buttonLabel, slide.mediaId, slide.openInNewWindow));
            }
        });
    }, true);

    var onSelectMedia = function (slide, mediaObject) {
        $log.info('onSelectMedia : mediaObject :', mediaObject);
        slide.mediaId = mediaObject.id;
        slide.mediaPath = mediaObject.thumbnail;
    }

    $scope.selectMedia = function (e, slide) {
        e.preventDefault();
        dialogService.mediaPicker({
            onlyImages: true,
            callback: function (mediaObject) {
                onSelectMedia(slide, mediaObject);
            }
        });
    }

    var onSelectContent = function (slide, contentObject) {
        contentResource.getNiceUrl(contentObject.id).then(function (ent) {
            slide.link = ent;
        });
    }

    $scope.selectNode = function(slide) {
        dialogService.contentPicker({
            multipicker: false,
            callback: function(contentObject) {
                onSelectContent(slide, contentObject);
            }
        });
    }

    $scope.addItem = function () {
        if (!$scope.slideList.slides) {
            $scope.slideList.slides = [];
            $scope.addItem();
        } else {
            var valid = true;
            angular.forEach($scope.slideList.slides, function (slide) {
                if (!$scope.isSlideValid(slide)) {
                    valid = false;
                }
            });
            if (valid) {
                $scope.slideList.slides.push(new Slide());
            }
        }
    }

    $scope.getMediaPath = function (slide) {
        if (slide.mediaId && !slide.mediaPath) {
            entityResource.getById(slide.mediaId, "Media").then(function (ent) {
                $log.log(ent);
                slide.mediaPath = ent.metaData.umbracoFile.Value.src;
            });
        }
    }

    $scope.isSlideValid = function (slide) {
        return slide.mediaId;

    }

    $scope.removeItem = function (testimonialIndex) {
        $scope.slideList.slides.splice(testimonialIndex, 1);
    }

    init();
}
angular.module("umbraco").controller("Mindbus.SlideShowController", mindbusSlideShowController);
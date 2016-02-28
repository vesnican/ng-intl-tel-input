(function (angular) {

  'use strict';

  angular.module('vesnican.intlTelInput', [])

    .constant('intlTelInputOptions', {})

    .directive('intlTelInput', function (
      intlTelInputOptions
    ) {
      return {
        restrict: 'AC',
        require: 'ngModel',
        scope: {
          intlTelInputOptions: '=',
          intlTelInputController: '='
        },
        link: function link ($scope, $element, attrs, modelCtrl) {

          // Building options for this control.
          var options = angular.extend({}, $scope.intlTelInputOptions || {}, intlTelInputOptions);

          // Initializing the control with the plugin.
          $element
            .intlTelInput(options)
            .done(function () {
              // Updating state of the model controller
              // when plugin finally initializes.
              updateModelValue();
              modelCtrl.$validate();
            })
          ;

          // Rendering view when model changes.
          modelCtrl.$render = function () {
            if (modelCtrl.$viewValue) {
              $element.intlTelInput('setNumber', modelCtrl.$modelValue);
            }
          };

          // Setting correct model value when view is modified.
          modelCtrl.$parsers.unshift(function () {
            return getModelValue();
          });

          // Validating the input.
          modelCtrl.$validators.phoneNumber = function (modelValue, viewValue) {
            if (!modelValue && !viewValue) {
              return true;
            }
            return $element.intlTelInput('isValidNumber');
          };

          // Destroying the plugin with the directive.
          $scope.$on('$destroy', function () {
            $element.intlTelInput('destroy');
          });

          if ('object' === typeof $scope.intlTelInputController) {
            $scope.intlTelInputController.setCountry = function (countryName) {
              $element.intlTelInput('setCountry', countryName);
              updateModelValue();
            };
          }

          $element.bind('country-change', updateModelValue);

          function getModelValue () {
            return $element.intlTelInput('getNumber');
          }

          function updateModelValue () {
            modelCtrl.$setViewValue(getModelValue());
          }

        }
      };
    })

  ;

})(angular);

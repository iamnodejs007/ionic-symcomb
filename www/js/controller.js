angular.module('symcomb').controller('GameController', 
    ['$scope', '$ionicModal', '$state', '$stateParams', '$window',
    function($scope, $ionicModal, $state, $stateParams, $window) {

    var maxMoveCount = 6;
    var maxComboSize = 4;
    var comboArray = [];
    var won = 'won';
    var lost = 'lost';
    var gameInProgress = false;

    $scope.images = ['spades', 'hearts', 'diamonds', 'clubs', 'star', 'target'];
    $scope.imagesList = [];
    $scope.cells = [];
    $scope.playArrayIndices = [];
    
    $scope.directHitsCount = 0;
    $scope.indirectHitsCount = 0;
    
    $scope.listOfCombinations = [];
    $scope.listOfHits = [];
    $scope.numberOfTrys = 0;

    function Target() {
        var imagesToMatch = [];

        function _getImages() {
            return _.clone(imagesToMatch);
        }

        function _setImages(arr) {
            imagesToMatch = arr;
        }  
        
        return {
            get: _getImages,
            set: _setImages
        };
    }

    var t = new Target();

    function generateGame() {
        var indices = [];
        
        for (var i = 0; i < 4; i++) {
            var randomNo = parseInt(Math.random() * 6);
            indices.push($scope.images[randomNo]);
        }

        t.set(indices);
        $scope.target = t.get();
        gameInProgress = true;
    }

    $scope.play = function() {
        var directCount = 0;
        var inDirectCount = 0;
        var a = $scope.imagesList;
        var b = t.get();
        var total = 0;
        var idx = $scope.numberOfTrys;

        $scope.numberOfTrys++;

        if ($scope.numberOfTrys <= maxMoveCount) {
            directCount = checkDirectHits(a, b);
            inDirectCount = checkIndirectHits(a, b); 

            a = $scope.imagesList;
            b = t.get();

            if (!directCount && !inDirectCount) {
                $scope.directCount = 0;
                $scope.inDirectCount = 0;

                if ($scope.numberOfTrys == maxMoveCount) {
                    gameOver(lost);
                }
            } else {
                if (directCount) {
                    total += directCount;
                }

                if (inDirectCount) {
                    total += inDirectCount;
                }

                if ($scope.numberOfTrys <= maxMoveCount && directCount == maxComboSize) {
                    updateUI(idx, directCount, inDirectCount);
                    gameOver(won);
                } else if ($scope.numberOfTrys == maxMoveCount && directCount < maxComboSize) {
                    updateUI(idx, directCount, inDirectCount);
                    gameOver(lost);
                } else {
                    $scope.directCount = directCount;
                    $scope.inDirectCount = inDirectCount;
                }
            }

            updateUI(idx, directCount, inDirectCount);
            $scope.playArrayIndices = [];
            $scope.imagesList = [];
            b = t.get();
        } else {
            gameOver(lost);
            updateUI(idx, directCount, inDirectCount);
        }     
    }

    function resetGame() {
        $window.location.reload(true)
        comboArray = [];
        imagesToMatch = [];
        $scope.imagesList = [];
        $scope.directHitsCount = 0;
        $scope.indirectHitsCount = 0;
        $scope.listOfCombinations = [];
        $scope.listOfHits = [];
        $scope.numberOfTrys = 0;
    }

    function checkDirectHits(playArray, targetArray) {
        var count = 0;
        var indices = [];

        for (var i = 0; i < playArray.length; i++) {
            if (playArray[i] == targetArray[i]) {
                count++;
                indices.push(i);        
            }
        }

        var len = count;

        if (len > 0) {
            while (len--) {
                playArray.splice(indices[len], 1);
                targetArray.splice(indices[len], 1);
            }
        
            return count;
        } else {
            return false;
        }

    }

    function checkIndirectHits(playArray, targetArray) {
        if (playArray.length > 0) {
            var count = 0;

            for (var i = playArray.length - 1; i >= 0; i--) {
                for (var j = targetArray.length - 1; j >= 0; j--) {
                    if (playArray[i] == targetArray[j]) {
                        playArray.splice(i, 1);
                        targetArray.splice(j, 1);
                        count++;
                        break;
                    }
                }
            }

            if (count > 0) {
                return count;
            } else {
                return false;
            }
        }

        return false;
    }

    function setCombinations(idx, arr) {
        var $children = $('#combo-list .row-' + idx).children();

        $children.each(function(i, el) {
            $(el).addClass('bg-' + arr[i]);
        });
    }

    function updateUI(idx, directCount, inDirectCount) {
        var directHit = 2;
        var inDirectHit = 1;
        var miss = 0;
        var hits = [];

        //$scope.listOfCombinations[idx].sub = $scope.playArrayIndices;
        
        setCombinations(idx, $scope.playArrayIndices);

        if (directCount && directCount > 0) {
            for (var i = 0; i < directCount; i++) {
                hits.push(directHit);
            }
        }

        if (inDirectCount && inDirectCount > 0) {
            for (var i = 0; i < inDirectCount; i++) {
                hits.push(inDirectHit);
            }
        }

        if (directCount && directCount > 0 && inDirectCount && inDirectCount > 0) {
            if ((directCount + inDirectCount) < maxComboSize) {
                var len = maxComboSize - directCount - inDirectCount;

                for (var i = 0; i < len; i++) {
                    hits.push(miss);
                }
            } 
           
        } else if (directCount && !inDirectCount) {
            var len = maxComboSize - directCount;

            for (var i = 0; i < len; i++) {
                hits.push(miss);
            }

        } else if (!directCount && inDirectCount) {
            var len = maxComboSize - inDirectCount;

            for (var i = 0; i < len; i++) {
                hits.push(miss);
            }

        } else {
            for (var i = 0; i < maxComboSize; i++) {
                hits.push(miss);
            }

        }

        $scope.listOfHits[idx].sub = hits;
        hits = [];
        $scope.playArrayIndices = [];
    }

    function generateCells() {
        var cells = [];

        for (var i = 0; i < 6; i++) {
            var cell = {};
            cell.sub = [];
            for (var j = 0; j < 4; j++) {
                cell.sub.push(9);
            }
            cells.push(cell);
        }

        $scope.listOfCombinations = _.clone(cells);
        $scope.listOfHits = _.clone(cells);
    }   

    function gameOver(msg) {
        if (msg == 'won') {
            $scope.msg = 'Congratullations! You have successfully solved the hidden combination!';
            $scope.answer = false;
            $scope.openModal();
        } else {
            $scope.msg = 'Sorry You did not guess the combination. The requested combination was: ';
            $scope.answer = t.get();
            $scope.openModal();
        }
        console.log($scope.msg);
    }

    $scope.startNewGame = function () {
        if (gameInProgress) {
            resetGame();
        }

        generateCells();
        generateGame();
    }

    $scope.addToList = function(img, idx) {
        var len = $scope.imagesList.length;
        if (len < 4) {
            $scope.imagesList.push(img);
            $scope.playArrayIndices.push(idx);
        }
        return false;
    };

    $scope.removeFromList = function(idx) {
        $scope.imagesList.splice(idx, 1);
        $scope.playArrayIndices.splice(idx, 1);
    };

    $scope.clear = function() {
        $scope.imagesList = [];
        $scope.playArrayIndices = [];
    };    

    $ionicModal.fromTemplateUrl('modal-dialog', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.startNewGame();
}]);
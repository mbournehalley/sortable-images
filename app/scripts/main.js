/*global jsonImages*/
/*eslint no-use-before-define:["error", { "functions": false }]*/
/*eslint-env es6*/

(function(window, document) {
  'use strict';

  var moveBox, // The moving box image
      moveBlock, // The parent of the moving box image
      moveBlockIndex, // Index of the moveBlock variable
      parentElement, // Represents the container of the box grid
      elementXCoordinates, // X coordinates of the box
      elementYCoordinates; // Y coordinates of the box

  window.initialize = initialize;

  /**
   * @name moveInit
   * @desc This function will initialize the images into a grid.
   */
  function initialize () {
    var gridDiv = document.getElementById('boxLayout');

    parentElement = document.getElementById('boxLayout');

    for (var i = 0; i < jsonImages.length; i++) {
      var newLi = document.createElement('li'),
          boxImg = document.createElement('img');

      newLi.className = 'block';
      boxImg.className = 'box';
      boxImg.src = jsonImages[i];
      boxImg.onmousedown = prepareMove;

      newLi.appendChild(boxImg);
      gridDiv.appendChild(newLi);
    }
    document.onmouseup = stopMove;
  }

  /**
   * @name prepareMove
   * @desc This function is called once a user clicks down on a box.
   *  The moveElement function is triggered once the user starts
   *  moving the box around.
   * @param {event} - the element event click
   */
  function prepareMove (event) {
    event.preventDefault();

    elementXCoordinates = event.pageX - event.currentTarget.offsetLeft;
    elementYCoordinates = event.pageY - event.currentTarget.offsetTop;

    if (typeof event.currentTarget !== 'undefined') {
      moveBlock = event.currentTarget.parentNode;
      moveBlockIndex = getChildIndex(parentElement, moveBlock);
      moveBox = event.currentTarget;
      moveBox.style.opacity = 0.5;
      moveBlock.appendChild(moveBox.cloneNode(true));
      moveBox.style.position = 'absolute';
      moveBox.style.zIndex = 2;
      moveBox.onmousemove = moveElement;
      moveElement(event);
    }
  }

  /**
   * @name moveElement
   * @desc This function is called when the user is moving the box around.
   *   It first finds the x & y mouse coordinate and calculates the
   *   new position of the moving box.
   * @param {event} - the element event click
   */
  function moveElement (event) {
    var block = parentElement.childNodes,
        mouseXCoordinates = event.pageX,
        mouseYCoordinates = event.pageY,
        newMouseXCoordinates = event.pageX - event.currentTarget.parentNode.offsetLeft,
        newMouseYCoordinates = event.pageY - event.currentTarget.parentNode.offsetTop;

    moveBox.style.left = (mouseXCoordinates - elementXCoordinates) + 'px';
    moveBox.style.top = (mouseYCoordinates - elementYCoordinates) + 'px';

    // Loop through the array all the boxes to determine new placement
    for (var i = 0; i < block.length; i++) {
      // targetIndex will be used to determine the new position in the array
      var targetIndex = getChildIndex(parentElement, block[i]);

      // Get the box constraints to compare with the coordinate of the moving box
      if (targetIndex !== moveBlockIndex) {
        var maxLeftConstraint = block[i].childNodes[0].offsetLeft + block[i].childNodes[0].clientWidth,
            maxTopConstraint = block[i].childNodes[0].offsetTop + block[i].childNodes[0].clientHeight,
            minLeftConstraint = block[i].childNodes[0].offsetLeft,
            minTopConstraint = block[i].childNodes[0].offsetTop;

        if (minTopConstraint <= newMouseYCoordinates && newMouseYCoordinates <= maxTopConstraint) {
          if (minLeftConstraint <= newMouseXCoordinates && newMouseXCoordinates <= maxLeftConstraint) {
            if (targetIndex < moveBlockIndex) {
              parentElement.insertBefore(moveBox.parentNode, block[i]);
            } else {
              insertAfter(block[i], moveBox.parentNode);
            }
            moveBlockIndex = getChildIndex(parentElement, moveBlock);
            break;
          }
        }
      }
    }
  }

  /**
   * @name getChildIndex
   * @desc As the user moves the box around, this function is called to
   *  find what the current index is where the box would be
   *  re-positioned.
   * @param {parent} - the element parent
   * @param {child} - the element child
   * @returns {number} - the index of the child
   */
  function getChildIndex (parent, child) {
    for (var i = 0; i < parentElement.childNodes.length; i++) {
      if (child === parent.childNodes[i]) {
        return i;
      }
    }
  }

  /**
   * @name insertAfter
   * @desc This function is called when the moving box is to be placed
   *   after its original location in the node list. If
   *   referenceNode.nextSibling is null, then it will insertBefore
   *   that node.
   * @param {referenceNode} - the reference node
   * @param {newNode} - the new node to be inserted.
   */
  function insertAfter (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**
   * @name stopMove
   * @desc This function is removes the clone/phantom box image
   *  and make the box, block, mouse listener null.
   * @param {event} - the event node.
   */
  function stopMove () {
    if (moveBox && moveBlock) {
      moveBox.style.opacity = 1;
      moveBox.style.position = 'static';
      moveBox.style.zIndex = 1;
      moveBox.onmousemove = null;
      moveBlock.removeChild(moveBlock.childNodes[1]);

      moveBox = null;
      moveBlock = null;
    }
  }

})(window, document);

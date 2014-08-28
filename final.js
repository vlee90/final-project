 // ---------- CLASS/OBJECT ----------
// User holds two Racks. One for "top" and another for "bottom" The array makes it easy for us to add on another rack for another type of clothing if needed.
function User(name){
  this.name = name;
  this.racks = [new Rack(), new Rack()];
}

// Rack's hold the clothing in the "item" array.
// The rack will NOT have any information regarding what type of item it SHOULD be holding. This type of sorting will be taken care of within a separate function.
// index is used to tell where in the "item" array the piece of clothing is supposed to go.
function Rack() {
  this.item = new Array();
  this.index = 0;
}

// colors and type will be passed to the class Clothing in array form (clothingtype[0] for example). This makes it easier to add another color or type later.
function Clothing(type, color, picture) {
  this.type = type;
  this.color = color;
  this.picture = picture;
  this.picked = false;
}
// ---------- END ----------


// --------- FUNCTIONS ----------
// Had to be global. Methods/functions are not saved via localStorage.
function addToRack(rack, clothing) {
  rack.item[rack.index] = clothing;
  rack.index++;
}
function getImgSource(clothing) {
  return clothing.picture;
}
function findIndexProp(array, property, propertyValue) {
  var includeIndexes = new Array();
  for(var i = 0; i < array.length; i++) {
    if(array[i][property] === propertyValue) {
      includeIndexes.push(i);
    }
  }
  return includeIndexes;
}
function pushArray(arrayOut, fullRack, arrayIndex) {
  $.each(fullRack, function(indexFullRack, valFullRack) {
    $.each(arrayIndex, function(index, value) {
      if(indexFullRack === value) {
        arrayOut.push(valFullRack);
      }
    });
  });
}
function getClothing(arrayOut, arraySource, property, propertyValues) {
  $.each(propertyValues, function(i, val) {
    var includeIndexes = findIndexProp(arraySource, property, val);
    pushArray(arrayOut, arraySource, includeIndexes);
  });
    if(arrayOut.length > 0) {
      var randomIndex = Math.floor(Math.random() * arrayOut.length);
      var secondClothing = arrayOut[randomIndex];
      localStorage.setItem("secondClothing", JSON.stringify(secondClothing));
      var firstClothing = JSON.parse(localStorage.getItem("firstClothing"));
      $("#match-top")[0].style.background = "url(" + firstClothing.picture + ") no-repeat center";
      $("#match-top")[0].style.backgroundSize = "250px 250px";
      $("#match-bottom")[0].style.background = "url(" + secondClothing.picture + ") no-repeat center";
      $("#match-bottom")[0].style.backgroundSize = "250px 250px";
    }
    else {
      alert("get more damn clothes you hobo");
      $("#match-top")[0].style.background = "";
      $("#match-bottom")[0].style.background = "";
    }
}
// ---------- END ----------


// ---------- SETTINGS ----------
// Declare colors and types within arrays so it will be easy to add things in the future.
var clothingColors = ["black","white","grey","blue","yellow","red","green","beige"];
var clothingType = ["top", "bottom"];
// ---------- END ----------



// ---------- SIGNUP BUTTON ----------
// Creates userObject on sign up button click. Will need to make similar function on log-in click. Will pass userObject to memory.
$('#signUpButton').on("click", function() {
  var username = $("#username").val();

  if(username === "") {
    $('#pleasefill').text("You do have to fill this stuff out, you know.")
  }
  else {
    var userObject = new User(username);
    localStorage.setItem("UserKey", JSON.stringify(userObject));
    window.location.href = 'closet.html';
  }
});
// ---------- END ----------


// ---------- ADD ITEM BUTTON ---------
// Creates clothing Object based on user drop. Grabs userObject from memory - parse it - sort it based on type - stringify it - return it to memory. Checks if user selected properties. User gets feedback via add-item button.
$("#add-item").on("click", function() {

  var type = $("#type-selector option:selected").attr("value");
  var color = $("#color-selector option:selected").attr("value");
  var wholeString = $('#dropbox').css("background-image");
  var source = wholeString.substring(4, wholeString.length - 1);
  if(type === "type" || color === "color" || wholeString === "none") {
    $("#add-item").val("pick properties");
  }
  else {
    var clothing = new Clothing(type, color, source);
    var userObject = JSON.parse(localStorage.getItem("UserKey"));
    if(clothing.type === clothingType[0]) {
      addToRack(userObject.racks[0], clothing);
    }
    else if (clothing.type === clothingType[1]) {
      addToRack(userObject.racks[1], clothing);
    }
    localStorage.setItem("UserKey",JSON.stringify(userObject));
  }
});
// Returns add-item button to default value on mouseoff.
$("#add-item").on("mouseleave", function() {
  $("#add-item").val("add item");
});
// ---------- END ----------


// ---------- LOAD CLOSET ----------- (MOVED TO SEPARATE JS)
// As soon as the DOM tree is created, will run this function. UserObject is retrived from memory and parsed - <img> tag assigned to top/bottom section with source.
$(function() {
  var userObject = JSON.parse(localStorage.getItem("UserKey"));
  $.each(userObject.racks[0].item, function(index, value) {
    $("#top-images").append("<img class='picture' src='"+ getImgSource(value) + "'>");
  });
  $.each(userObject.racks[1].item, function(index, value) {
    $("#bottom-images").append("<img class='picture' src='"+ getImgSource(value) + "'>");
  });
});
// // ---------- END ----------

// ---------- DELETE CLOTHING ----------
$(window).load(function () {
  $(".picture").on('click',function() {
    alert($(this).attr('src'));
    delObj = $(this).attr('src');
  })
})

//   var userObject = JSON.parse(localStorage.getItem("UserKey"));

//   $.each(userObject.racks[0].item, function(index, value) {
//     if(userObject.racks[0].item[index].picture === delObj) {
//       userObject.racks[0].item.splice(index, 1);
//     }
//   });

//   localStorage.setItem("UserKey", JSON.stringify(userObject));
// });
// ---------- END ----------


// ---------- GENERATE OUTFIT BUTTON -----------
$("#nav-3, #generate").on("click", function() {
  var userObject = JSON.parse(localStorage.getItem("UserKey"));
  pickNextItem(userObject);
});
// ---------- END ----------


//  ---------- PICK FIRST ITEM -----------
// Randomly pick clothes item from largest array.
function pickFirstItem(user) {
  var randomIndex = Math.floor(Math.random() * user.racks[0].item.length);

  var firstClothing = user.racks[0].item[randomIndex];
  localStorage.setItem("firstClothing", JSON.stringify(firstClothing));
}
// ---------- END ----------


// ---------- PICK NEXT ITEM ----------
function pickNextItem(user) {
  pickFirstItem(user);
  var firstClothing = JSON.parse(localStorage.getItem("firstClothing"));
  rules(firstClothing, user);
}
// ---------- END ----------


// ---------- MATCH 2ND ITEM -----------
function rules(firstClothing, user) {
  var firstColor = firstClothing.color;
  var tempArray = new Array(); /*Will copy a rack for so code doesn't change the user's rack*/
  userRack = user.racks[1].item; /*tempArray now holds all of the user's bottoms*/
  switch(firstColor) {
    case clothingColors[0] : /*black*/
      var legalColors = [clothingColors[1],clothingColors[2],clothingColors[3],clothingColors[4],clothingColors[5],clothingColors[6],clothingColors[7]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[1] : /*white*/
      var legalColors = [clothingColors[0],clothingColors[2],clothingColors[3],clothingColors[4],clothingColors[5],clothingColors[6],clothingColors[7]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[2] : /*grey*/
      var legalColors = [clothingColors[0],clothingColors[1],clothingColors[3],clothingColors[4],clothingColors[5],clothingColors[6],clothingColors[7]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[3] : /*blue*/
      var legalColors = [clothingColors[1],clothingColors[2],clothingColors[4],clothingColors[7]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[4] : /*yellow*/
      var legalColors = [clothingColors[1],clothingColors[2],clothingColors[3]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[5] : /*red*/
      var legalColors = [clothingColors[0],clothingColors[1],clothingColors[2],clothingColors[3],clothingColors[7]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[6] : /*green*/
      var legalColors = [clothingColors[1],clothingColors[2],clothingColors[3],clothingColors[4]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
    case clothingColors[7] : /*beige*/
      var legalColors = [clothingColors[1],clothingColors[2],clothingColors[3]];
      getClothing(tempArray, userRack, "color", legalColors);
      break;
  }
}
// ---------- END ----------


// ---------- DRAG/DROP ---------- (MOVED TO SEPARATE JS)
  // var dropbox = $('#dropbox')[0]
  // var state = $('#state')[0]
  // // Checks for FileReader
  // if(typeof window.FileReader === 'undefined') {
  //   alert("File API & FileReader unavailable.")
  //   // state.className = 'fail' ;
  // } else {
  //   console.log("File API & FileReader available")
  //   // state.className = 'success';
  //   // state.innerHTML = 'File API & FileReader available'
  // }
  // dropbox.ondragover = function() {
  //   this.className = 'hover'; return false;
  // };
  // dropbox.ondragend = function () {
  //   this.className = ''; return false;
  // };
  // dropbox.ondrop = function (e) {
  //   this.className = 'dropped';
  //   e.preventDefault();
  //   var file = e.dataTransfer.files[0],
  //       reader = new FileReader();
  //   reader.onload = function (event) {
  //     console.log(event.target);
  //     dropbox.style.background = 'url('+ event.target.result + ') no-repeat center';
  //     dropbox.style.backgroundSize = "250px 250px";
  //   };
  //   console.log(file);
  //   reader.readAsDataURL(file);
  // }
// ---------- END ----------



// })

// // Category is either bottomRack
// function pickClothes(color,category) {
//   for(i = 0; i < bottomRack.length; i++){
//     if(bottomRack.item.color === "white") {
//       tempRack[i] = bottomRack[i];
//     }
//   }
// }
// // Unsure if to use User.rack.startItem or just startItem.
// function match(startItem) {
//   if(startItem.category === "top") { /* Ensures startItem is a top */
//     switch(startItem.color) {
//       case "blue":
//         for(i = 0; i < bottomRack.length; i++){
//           if(bottomRack.item.color === "white") {
//             tempRack[i] = bottomRack[i];
//           }
//         }
//       case "black":
//         for(i = 0; i < bottomRack.length; i++){
//           if(bottomRack.item.color === "white") {
//             tempRack[i] = bottomRack[i];
//     }
//   }
//   else {
//     switch(startItem.color) {
//       case blue:
//     }
//   }
// }

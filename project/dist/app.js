var $header = $("h1");
var $sidebar = $(".sidebar");
var currentAlbum = -1;
var $container = $(".main-container");
var $buttonParent = $(".sidebar ul");
var $returnButton = $(".return-to-album");
var currentPhoto = -1;
var maxPhotos = 0;
data.forEach(function(album){
  if (album.photos.length > maxPhotos){
    maxPhotos = album.photos.length;
  }
});

var albumString = "<div class=\"album\"><img src=\"\"/><p></p></div>";
var buttonString = "<li><button class=\"album-btn\">Button Name</button></li>";


$(document).ready(function(){

  //**********CREATE ALBUMS AND SIDEBAR BUTTONS*********

  renderHome(data);

  var $boxes = $(".album"); // the boxes being displayed
  var $albumButtons = $(".album-btn");
  //*********************************************

  //*************LISTENERS***********************
  $albumButtons.on("click", function(evt){
    $albumButtons.each(function(index, item){
      $(item).removeClass("active");
    });
    $(evt.target).addClass("active");
    data.forEach(function(album, i){
      if ($(evt.target).text() === album.name){
        currentAlbum = i;
      }
    });
    renderAlbum(currentAlbum, data);
  });

  // clicking on albums themselves
  // albums will be repurposed as photos
  $boxes.on("click", function(evt){
    var $clicked = $(evt.target);
    if ($clicked[0].className !== "album"){
      $clicked = $clicked.parent();
    }
    if (currentAlbum > -1){
      // if looking at photos, expand to individual photo view
      $sidebar.addClass("hidden");
      data[currentAlbum].photos.forEach(function(photo, index){
        if (photo.title === $clicked.text()){
          currentPhoto = index;
        }
      });
      renderPhoto(currentAlbum, data, currentPhoto);
    } else {
      // if looking at albums, change to view all photos
      currentAlbum = $boxes.index($clicked);
      $sidebar.removeClass("hidden");
      renderAlbum(currentAlbum, data);
    }
  });

  $(".return-to-album").on("click", function(){
    renderAlbum(currentAlbum, data);
  });


  $(".left-arrow").on("click", function(){
    currentPhoto = (currentPhoto + data[currentAlbum].photos.length - 1) % data[currentAlbum].photos.length;
    renderPhoto(currentAlbum, data, currentPhoto);
  });

  $(".right-arrow").on("click", function(){
    currentPhoto = (currentPhoto + data[currentAlbum].photos.length + 1) % data[currentAlbum].photos.length;
    renderPhoto(currentAlbum, data, currentPhoto);
  });

  //*****************************************

  // ***********RENDER FUNCTIONS************
  function renderHome(photoData){
    // show all albums with "my albums" header
    // only happens once
    for (var i = 0; i < maxPhotos; i ++){
      var $newDiv = $(albumString);
      $newDiv.addClass("hidden");
      if (i < photoData.length){
        $newDiv.removeClass("hidden");
        $newButton = $(buttonString);
        $newDiv.children("img").attr("src", photoData[i].photos[0].source);
        $newDiv.children("p").text(photoData[i].name);
        var $newButton = $(buttonString);
        $newButton.children("button").text(photoData[i].name);
        $buttonParent.append($newButton);
      }
      $container.append($newDiv);
    }
  }

  function renderAlbum(albumIndex, photoData){
    // show all photos in album with album title header
    currentPhoto = -1;
    $container.css("margin-left", "200px");
    $container.removeClass("preview");
    $sidebar.removeClass("hidden");
    $header.text(photoData[albumIndex].name);
    $boxes.each(function(photoIndex, box){
      $(box).addClass("hidden");
      if (photoIndex < photoData[albumIndex].photos.length){
        $(box).removeClass("hidden");
        $(box).children("img").attr("src", photoData[albumIndex].photos[photoIndex].source);
        $(box).children("p").text(photoData[albumIndex].photos[photoIndex].title);
      }
    });
  }

  function renderPhoto(albumIndex, photoData, photoIndex){
    // display photo title, expanded photo, and button to return to album
    $container.css("margin-left", "0px");
    $returnButton.text("Back to " + photoData[albumIndex].name);
    $header.text(photoData[albumIndex].photos[photoIndex].title);
    $boxes.each(function(index, item){
      $(item).addClass("hidden");
    });
    $container.addClass("preview");
    $(".preview-img").attr("src", photoData[albumIndex].photos[photoIndex].source);
  }
});

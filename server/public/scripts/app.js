$(function() {
  /*
  	*Takes in a person object and writes the info to the DOM through Handlebars
  	*while fading out and in
  	*/
  function renderPerson(person) {
    var compiledHTML = personTemplate({name: person});
    $('section').fadeOut(1000, function() {
      $(this).html(compiledHTML);
    }).fadeIn(1000);
  };
  /*
  * Both of the following functions take in a person object and write the info
  * to the corresponding button on the DOM using Handlebars
  */
  function renderPrevious(person) {
    var compiledHTML = prevTemplate({button: person});
    $('.prev').fadeOut(1000, function() {
      $(this).html(compiledHTML);
    }).fadeIn(1000);
  }

  function renderNext(person) {
    var compiledHTML = nextTemplate({button: person});
    $('.next').fadeOut(1000, function() {
      $(this).html(compiledHTML);
    }).fadeIn(1000);
  }

  /*
  * Pulls json file from server, finding the index of the array that matches
  * who is currently displayed. Ensures that the cycle "loops" properly before
  * calling the necessary render functions with the proper indexes to change the
  * buttons and cycle to the next person in the json array
*/
  function nextPerson() {
    $.ajax({
      url: '/data/eta.json'
    }).done(function(data) {
      for (var i = 0; i < data.eta.length; i++) {
        if (data.eta[i].lastName == $('a').attr('class')) {
          if (i + 1 == data.eta.length) {
            var newPerson = data.eta[0];
            var newPrevious = data.eta[data.eta.length - 1];
            var newNext = data.eta[1];
          } else if (i + 2 == data.eta.length) {
            var newPerson = data.eta[i + 1];
            var newPrevious = data.eta[i];
            var newNext = data.eta[0];
          } else {
            var newPerson = data.eta[i + 1];
            var newPrevious = data.eta [i];
            var newNext = data.eta[i + 2];
          }
          break;
        }
      }
      renderPrevious(newPrevious);
      renderNext(newNext);
      renderPerson(newPerson);
    });
  };
  /*
  * The same as the previous function, except displays the previous person
  */
  function previousPerson() {
    $.ajax({
      url: '/data/eta.json'
    }).done(function(data) {
      for (var i = 0; i < data.eta.length; i++) {
        if (data.eta[i].lastName == $('a').attr('class')) {
          if (i == 0) {
            var newPerson = data.eta[data.eta.length - 1];
            var newPrevious = data.eta[data.eta.length - 2];
            var newNext = data.eta [0];
          } else if (i - 1 == 0) {
            var newPerson = data.eta[i - 1];
            var newPrevious = data.eta[data.eta.length - 1];
            var newNext = data.eta[i];
          } else {
            var newPerson = data.eta[i - 1];
            var newPrevious = data.eta[i - 2];
            var newNext = data.eta[i];
          }
          break;
        }
      }
      renderPrevious(newPrevious);
      renderNext(newNext);
      renderPerson(newPerson);
    });
  };

  /*
  * Start up logic. Prepare templates for Handlebars while starting an interval
  * to go to the next person. Gets the json from the server and selects a random
  * person to display initially.
*/
  var prevTemplate = Handlebars.compile($('#prev').html());

  var nextTemplate = Handlebars.compile($('#next').html());

  var personTemplate = Handlebars.compile($('#name').html());

  var everyTenSeconds = setInterval(nextPerson, 10000);

  $.ajax({
    url: '/data/eta.json'
  }).done(function(data) {
    var randomIndex = Math.floor(Math.random() * data.eta.length);
    if (randomIndex === data.eta.length - 1) {
      renderPrevious(data.eta[randomIndex - 1]);
      renderNext(data.eta[0]);
    } else if (randomIndex === 0) {
      renderNext(data.eta[randomIndex + 1]);
      renderPrevious(data.eta[data.eta.length - 1]);
    } else {
      renderPrevious(data.eta[randomIndex - 1]);
      renderNext(data.eta[randomIndex + 1]);
    }
    renderPerson(data.eta[randomIndex]);

  });

  /*
  * Previous person button event handler. Calls the previous person function
  * before resetting the interval
*/
  $('.prev').on('click', function() {
    previousPerson();
    clearInterval(everyTenSeconds);
    everyTenSeconds = setInterval(nextPerson, 10000);
  });

  /*
  * The same except for the next person
*/

  $('.next').on('click', function() {
    nextPerson();
    clearInterval(everyTenSeconds);
    everyTenSeconds = setInterval(nextPerson, 10000);
  });
});

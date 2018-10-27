$(document).ready(function() {
  
  function selectCharacter(characterHP, characterName, ap) {
    $('#darthVader, #lukeSkywalker, #obiWanKenobi, #yoda').on('click', function(event) {
      $('#start').empty();

      var chosenCharacter = event.currentTarget.id;
      $('#character').html(
        `<div id=${chosenCharacter}> ${
          characterName[chosenCharacter]
        }<br><img class='img-thumbnail' src="assets/images/${chosenCharacter}.jpg" alt=""><br><p id="${chosenCharacter}Value">${
          characterHP[chosenCharacter]
        }</p></div>`
      );

      var enemies = Object.keys(characterName).filter(enemy => {
        return enemy !== chosenCharacter;
      });
     
      enemies.forEach(enemy => {
        $('#enemies').append(
          `<div class="w-25 p-3" id=${enemy}> ${
            characterName[enemy]
          }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
            characterHP[enemy]
          }</p></div>`
        );
        $(`#${enemy}`).css({
          'background-color': 'red',
          'border-color': 'black',
          'border-width': '1px',
          padding: '2px'
        });
      });

      var enemyIDs = enemies
        .map(enemy => {
          return '#' + enemy;
        })
        .toString();
      var click = 0;
      
      $(enemyIDs).one('click', function(enemy) {
        click++;
       
        if (click === 1) {
          var enemy = enemy.currentTarget.id;
          $('#' + enemy).remove();

          $('#defender').html(
            `<div id=${enemy}> ${
              characterName[enemy]
            }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
              characterHP[enemy]
            }</p></div>`
          );
        }
      });
    });
  }

  function displayEnemy(remainingEnemies, characterName, characterHP) {
    $(remainingEnemies.toString()).one('click', function(enemy) {
      var enemy = enemy.currentTarget.id;
      $('#' + enemy).remove();

      $('#defender').html(
        `<div id=${enemy}> ${
          characterName[enemy]
        }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
          characterHP[enemy]
        }</p></div>`
      );
      $('#defender').show();
    });
  }

  function attack(characterHP, characterName, ap) {
    var defeatedEnemyList = [];
    var clicks = 1;

    $('#attack').on('click', function(event) {
      if ($('#start').children().length !== 4 && $('#defender').children().length !== 0) {
        var character = $('#character').children()[0].id;
        var enemy = $('#defender').children()[0].id;

         characterHP[enemy] -= ap[character] * clicks;
        $('#' + enemy + 'Value').html(characterHP[enemy]);
        if (characterHP[enemy] > 0) {
          characterHP[character] -= ap[enemy];
          $('#' + character + 'Value').html(characterHP[character]);
        }

        if (characterHP[character] > 0 && characterHP[enemy] > 0) {
          $('#message').html(
            `<p>You attacked ${characterName[enemy]} for ${ap[character] *
              clicks} damage.</p><p>${
              characterName[enemy]
            } attacked you back for ${ap[enemy]} damage.`
          );
        } else if (characterHP[character] > 0 && characterHP[enemy] < 0) {
          defeatedEnemyList.push(enemy);
          $('#message').html(
            `<p>You have defeated ${
              characterName[enemy]
            }, you can choose to fight another enemy.</p>`
          );

          $('#defender').hide();
          var remainingEnemies = [];
          for (let i = 0; i < $('#enemies').children().length; i++) {
            remainingEnemies.push('#' + $('#enemies').children()[i].id);
          }
          displayEnemy(remainingEnemies, characterName, characterHP);

          defeatedEnemyList = Array.from(new Set(defeatedEnemyList));
          if (defeatedEnemyList.length === 3) {
            $('#message').text('You win!! GAME OVER!!');
            $('#message').append("<br><button id='restart'>Restart</button>");
          }
        } else {
          $('#message').text('You have been defeated... GAME OVER!!');
          $('#message').append("<br><button id='restart'>Restart</button>");
        }
        clicks++;
      }
    });
  }

  function reset() {
    var characterHP = {
      darthVader: 120,
      lukeSkywalker: 100,
      obiWanKenobi: 150,
      yoda: 180
    };
    var characterName = {
      darthVader: 'Darth Vader',
      lukeSkywalker: 'Luke Skywalker',
      obiWanKenobi: 'Obi Wan Kenobi',
      yoda: 'Yoda'
    };
    
    var ap = {
      darthVader: 8,
      lukeSkywalker: 5,
      obiWanKenobi: 20,
      yoda: 25
    };
    selectCharacter(characterHP, characterName, ap);
    attack(characterHP, characterName, ap);
  }

  $(document).on('click', '#restart', function() {
    $('.container').html(
      '<h2>Rules: 1) select character 2) select defender 3) Attack! 4) Repeat 2 and 3</h2><div id="start"><div id="darthVader">Darth Vader<br><img class="img-thumbnail" src="assets/images/darthVader.jpg" alt=""><br><p id="darthVaderValue">120</p></div><div id="lukeSkywalker">Luke Skywalker<br><img class="img-thumbnail" src="assets/images/lukeSkywalker.jpg" alt=""><br><p id="darthVaderValue">100</p></div><div id="obiWanKenobi">"Obi Wan Kenobi"<br><img class="img-thumbnail" src="assets/images/obiWanKenobi.jpg" alt=""><br><p id="darthVaderValue">150</p></div><div id="yoda">Yoda<br><img class="img-thumbnail" src="assets/images/yoda.jpg" alt=""><br><p id="darthVaderValue">180</p></div></div><h2>Your character</h2><div id="character"></div><h2>Enemies Available To Attack</h2><div id="enemies"></div><h2>Fight Section</h2><button id="attack">Attack</button><div id="message"></div><h2>Defender</h2><div id="defender"></div>'
    );
    reset();
  });

  reset();
});

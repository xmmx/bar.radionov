$(function () {
  let data;
  let allIngridients = {};
  let filterOptions = {
    type: "cocktails",
    basedOn: [],
    without: []
  };
  let availableIngridients = [];

  const $T_badge = $('<div>').addClass('card-badge');
  const $T_tag = $('<span>').addClass('tag');

  const $cardsContainer = $('#cardsContainer');
  const $ingridientsBased = $('#tagContainer-basedOn');
  const $ingridientsAbsent = $('#tagContainer-without');

  // Back flip of the card
  const displayIngridients = (ingridients => {
    const result = [];
    Object
      .keys(ingridients)
      .sort((a, b) => ingridients[b] - ingridients[a])
      .map(name => {
        const info = allIngridients[name];
        const value = ingridients[name];

        result.push($('<ol class="list-outside">')
          .append($('<li>')
            .attr('value', value)
            .text(name)
          )
        )
      })
    return result;
  })

  // Info for card badges
  const getInfo = (target, isRecursive) => {
    let totalLiquid = 0;
    let absAlc = 0;
    let price = 0;

    Object.keys(target.ingridients).forEach(name => {
      const value = target.ingridients[name];
      let info = allIngridients[name];
      if (!info) {
        alert(`Not found "${name}"`);
        return false;
      }
      if (info.ingridients) {
        info = {
          ...info,
          ...getInfo(info, true),
          unitType: "мл"
        };
      }

      if (info.unitType == "мл") {
        totalLiquid += value;
        if (info.alc) {
          absAlc += value * info.alc / 100;
        }
      } else if (name == "сахар") {
        // convert sugar to ml
        totalLiquid += value * 0.6;
      }

      price += value * info.price;
    })

    const alc = (absAlc / totalLiquid * 100).toFixed(0);
    if (isRecursive) price = price / totalLiquid;
    price = price.toFixed(0);
    return {
      alc,
      value: totalLiquid.toFixed(0),
      price
    };
  };

  const sortList = ($target, ignoreFilter) => {
    const children = $target.children()
      .filter((i, item) => {
        return !filterOptions[ignoreFilter].includes($(item).text())
      })
      .sort((a, b) => $(b).text > $(a).text());
    $target.html('').append(children);
  };

  const methodIcon = {
    'stir': 'refresh',
    'shake': 'swap_vert',
    'layers': 'table_rows',
    'blend': 'blender',
    'hot':'local_fire_department'
  }

  // Create cards
  let cardIndex = 0;
  const makeCard = (title, cardObject) => {
    const surfaceCardIndex = cardIndex % 4 + 1;
    const $card = $('<article/>').addClass(`card surface${surfaceCardIndex}`);
    const badges = [];

    const info = getInfo(cardObject);

    const alc = info.alc || cardObject.alc;
    
    if (alc) badges.push($T_badge.clone().addClass('alcohol').html(`${alc}&deg;`));

    if (info.value) badges.push($T_badge.clone().html(`${info.value}ml`));
    if (info.price) badges.push($T_badge.clone().html(`${info.price}₽`));

    if (cardObject.color) {
      badges.push($T_badge.clone()
        .css('backgroundColor', cardObject.color)
        .html('&nbsp;&nbsp;&nbsp;')
      );
    }

    if (cardObject.method) {      
      badges.push($('<span>')
        .css({'float':'right', 'fontSize':'24px'})
        .addClass('icon-asset material-symbols-outlined')
        .html($('<span>').text(methodIcon[cardObject.method]))
      );
    }

    const $cardFront = $('<div class="card-front">');
    const $cardBack = $('<div class="card-back">');
    const imgUrl = cardObject.img ? `/img/${title.toLowerCase().replace(/\s/g,'_')}.jpg` : 'https://via.placeholder.com/450';
    $cardFront
      .append($('<div>').append(badges))
      .append($('<br/>'))
      .append($('<img/>')
        .addClass('img-cover')
        .attr('src', imgUrl)
        .attr('alt', title)
        .attr('loading', 'lazy')
        .attr('decoding', 'async')
        .attr('width', '100%')
        .attr('height', '200px')
      )
      .append($('<h3>').text(title));

    $cardBack
      .append($('<p>').append(displayIngridients(cardObject.ingridients)))
      .append($('<p>')
        .html(
          cardObject.recepie.length > 1 ?
          $('<p>').append(
            cardObject.recepie.map(elem => $('<div>').css('paddingBottom', 8).text(elem))
          ) : cardObject.recepie
        )
      );

    $card.append($('<div class="card-inner">').append([$cardFront, $cardBack]));

    Object.keys(cardObject.ingridients).forEach(item => {
      if (!availableIngridients.includes(item)) {
        availableIngridients.push(item);

        $ingridientsBased.append(
          $T_tag.clone()
          .text(item)
          .addClass('based-on')
        );

        if (!filterOptions.basedOn.includes(item)) {
          $ingridientsAbsent.append(
            $T_tag.clone()
            .text(item)
            .addClass('without')
          );
        }
      }
    });

    cardIndex++;
    return $card;
  };

  // Fill board with cards
  const fillCardsContainer = () => {
    dialog.close();
    // clear containers
    $('#dialog-container').html("");
    $cardsContainer.html("");
    $ingridientsBased.html("");
    $ingridientsAbsent.html("");
    availableIngridients = [];

    // define target of display (coctails, liquors, etc)
    const target = data[filterOptions.type];
    // generate cards
    Object
      .keys(target)
      .filter(title => {
        let flag = true;
        const currentIngridients = Object.keys(target[title].ingridients);

        // проверка на исключения
        if (filterOptions.without.length) {
          currentIngridients.forEach(name => {
            // исключаем, если содержит запрещенный ингридиент
            if (filterOptions.without.includes(name)) flag = false;
            // иначе ничего не меняем
          });
        }

        // если еще не исключен и есть список обязательных ингридиентов
        if (flag && filterOptions.basedOn.length) {
          filterOptions.basedOn.forEach(item => {
            // исключаем, если не содержит обязательного ингридиента
            if (!currentIngridients.includes(item)) flag = false;
          })
        }
        return flag;
      })
      .forEach(title => {
        $cardsContainer.append(makeCard(title, target[title]))
      });

    const cards =
      $cardsContainer.children()
      .sort((a, b) => {
        a = parseInt($(a).find('.alcohol').text());
        b = parseInt($(b).find('.alcohol').text());
        return a - b;
      });
    
    $cardsContainer.html('').append(cards);

    $('.card').click((e) => {
      $(e.currentTarget).toggleClass('flipped');
    });

    sortList($ingridientsBased, 'basedOn');
    sortList($ingridientsAbsent, 'without');

    filterOptions.without.forEach(item => {
      $ingridientsAbsent.prepend($T_tag.clone().text(item).addClass('without selected'))
    });
    filterOptions.basedOn.forEach(item => {
      $ingridientsBased.prepend($T_tag.clone().text(item).addClass('based-on selected'))
    });

    $('.tag').click((e) => {
      const $elem = $(e.currentTarget);
      const target = $elem.hasClass('without') ? 'without' : 'basedOn';
      const tagName = $elem.text();

      // should we remove tag?
      if ($elem.hasClass('selected')) {
        filterOptions[target] = $.grep(filterOptions[target], (v) => v != tagName)
      } else {
        // or add new one        
        filterOptions[target].push(tagName)
        $elem.addClass('selected');
      }
      // redraw all cards
      fillCardsContainer();
    })
  };

  // Load data and diplay default state
  $.getJSON('./data/data.json', (d) => {
    data = d;
    allIngridients = {
      ...data["ingridients"],
      ...data["complexIngridients"],
      ...data["liquors"]
    };
    fillCardsContainer();
  });

  // filter events
  $('.btn-change-type').click((e) => {
    $('.btn-change-type').prop('disabled', false);
    const $elem = $(e.currentTarget);
    filterOptions.type = $elem.attr('data-rel');
    $elem.prop('disabled', true);
    fillCardsContainer();
  })

  let dialogSourceId;
  $('#btn-without-enabled, #btn-show-based-on').click((e) => {
    dialogSourceId = $(e.currentTarget).attr('for');
    $(dialogSourceId).children().prependTo($('#dialog-container'))
    dialog.showModal();
  });
  dialog.addEventListener('close', (event) => {
    $('#dialog-container').children().prependTo($(dialogSourceId));
  });
  $('#dialog-close').click(()=>{dialog.close();})

});

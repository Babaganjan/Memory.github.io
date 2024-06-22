(() => {

  let countCards = null;

  const cardsNumberArray = [];

  let firstCard = null;
  let secondCard = null;

  function createContainer() {
    const container = document.createElement('div');
    container.classList.add('container');

    return container;
  }
  // Создаем элемент 'h1'
  function createAppTitle(title) {
    const appTitle = document.createElement('h1');
    appTitle.innerHTML = title;
    appTitle.classList.add('heading');

    return appTitle;
  }

  function createResultGame(title, color) {
    const resultTitle = document.createElement('h2');
    resultTitle.classList.add('victory');
    resultTitle.innerHTML = title;
    resultTitle.style.color = color; // устанавливаем цвет текста

    return resultTitle;
  }
  // Создаем форму для выбора количество пар
  function createFormCards() {
    const form = document.createElement('form');
    form.classList.add('form');
    const input = document.createElement('input');
    input.classList.add('input');
    input.type = 'number';
    input.placeholder = 'Введите четное число от 2 до 10';
    const button = document.createElement('button');
    button.classList.add('button')
    button.textContent = 'Начать игру';

    button.disabled = true;

    input.addEventListener('input', () => {
      if (input.value !== '') {
        button.disabled = false;
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (input.value >= 2 && input.value <= 10 && input.value % 2 === 0) {
        countCards = input.value;
      } else {
        countCards = 4;
      }

      const list = document.querySelector('.list');

      if (list !== null) {
        list.remove();
        let timeOver = document.querySelector('.time')
        timeOver.remove();
        gameOver.remove()
        gameVictory.remove();
      }

      appStartGame(gameContainer);

      button.disabled = true;
    });

    button.addEventListener('click', () => {
      // Добавьте таймер в одну минуту, по истечении которого игра сразу завершается, даже если ещё не открыты все карточки
      // Устанавливаем время в секундах (например, 60 секунд)
      let gameTime = 60;
      let timeoutId; // Идентификатор для таймера

      // Создаем элемент для отображения таймера
      const timerElement = document.createElement('div');
      timerElement.classList.add('time');
      timerElement.textContent = `Время: ${gameTime}`;
      gameContainer.appendChild(timerElement);

      // Функция для открытия карточек
      function openAllCards() {
        // Получаем все элементы с классом '.card'
        const cards = document.querySelectorAll('.card');
        // Проходим по каждой карточке
        for (const card of cards) {
          // Присваеваем класс карточкам
          card.classList.add('open');
        }
      }

      // Функция для обновления таймера
      function updateTimer() {
        gameTime--;
        timerElement.textContent = `Время: ${gameTime}`;
        if (gameTime === 0) {
          // Игра закончена
          openAllCards();
          cardsNumberArray.length = 0;
          gameForm.input.value = '';
          gameContainer.append(gameOver);
          // Условие для остановки таймера при победе
        } else if (cardsNumberArray.length === document.querySelectorAll('.success').length) {
          clearTimeout(timeoutId); // Остановка таймера
          setTimeout(() => {
            gameForm.input.value = '';
            cardsNumberArray.length = 0;
            gameContainer.append(gameVictory);
          }, 300)
        } else {
          // Продолжаем обновлять таймер каждую секунду
          timeoutId = setTimeout(updateTimer, 1000);
        }
      }
      // Запускаем таймер
      timeoutId = setTimeout(updateTimer, 1000);
    });

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    }
  }
  // Создаем элемент 'ul' для списка
  function createList() {
    const cardsList = document.createElement('ul');
    cardsList.classList.add('list');

    return cardsList;
  }
  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить
  // функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].
  function createGeneratingArray(arr) {
    for (let i = 1; i <= countCards; i++) {
      arr.push(i, i);
    }
    return arr;
  }
  // Этап 2. Создайте функцию перемешивания массива. Функция принимает в аргументе исходный массив и возвращает перемешанный.
  function mixArrayCards(arr) {
    for (let i = 0; i < arr.length; i++) {
      let randomIndex = Math.floor(Math.random() * arr.length);
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
  }
  // Этап 3. Используйте функции из этапов 1 и 2 для создания массива с перемешанными номерами.
  // Этап 4. На основе массива создайте DOM-элементы карточек:
  // Создайте функцию, которая будет создавать карточку с номером из массива произвольных чисел.
  // Добавьте событие клика, в котором будут условия и проверки на совпадение карточек.
  function createItemList(arr, ul) {
    for (let itemCard of arr) {
      const card = document.createElement('li');
      card.textContent = itemCard;
      card.classList.add('card');
      ul.append(card);

      card.addEventListener('click', () => {

        if (card.classList.contains('open') || card.classList.contains('success')) {
          return;
        }

        if (firstCard !== null && secondCard !== null) {
          firstCard.classList.remove('open');
          secondCard.classList.remove('open');
          firstCard = null;
          secondCard = null;
        }

        card.classList.add('open');

        if (firstCard === null) {
          firstCard = card;
        } else {
          secondCard = card;
        }

        if (firstCard !== null && secondCard !== null) {
          let firstCardNumber = firstCard.textContent;
          let secondCardNumber = secondCard.textContent;

          if (firstCardNumber === secondCardNumber) {
            firstCard.classList.add('success');
            secondCard.classList.add('success');
          }
        }
      });
    }
    return arr;
  }

  const gameContainer = createContainer();
  const gameAppTitle = createAppTitle('Игра Пары');
  const gameForm = createFormCards();
  const gameVictory = createResultGame('ПОБЕДА !!!', 'lime');
  const gameOver = createResultGame('ВЫ ПРОИГРАЛИ !!!', 'red');
  document.body.append(gameContainer);
  gameContainer.append(gameAppTitle);
  gameContainer.append(gameForm.form);
  // Запуск игры
  function appStartGame(container) {
    createGeneratingArray(cardsNumberArray);
    mixArrayCards(cardsNumberArray);
    const gameList = createList();
    createItemList(cardsNumberArray, gameList);

    container.append(gameList);
  }

})();

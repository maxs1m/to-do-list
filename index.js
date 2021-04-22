const newTask = document.querySelector('.input__task'); 																						// Ищем поле ввода новой задачи
const search = document.querySelector('.header__search');
const sumbitBtn = document.querySelector('.btn__add'); 																							// Ищем кнопку добавить задачу
const ul = document.querySelector('.task__list'); 																									// Ищем список куда будут добавлены задачи
let sessionMass = JSON.parse(localStorage.getItem('session')) || []; 															// Получаем массив сессии из сохраненных элементов списка в localStorage или же пустой массив
let counter = sessionMass.length; 																																// счетчик для id пунктов, присваиваем длинну массива чтоб не повторяться и продолжить счет

const sort = document.querySelector('.sort');
const sortItems = document.querySelectorAll('.sort__item');
const allBtn = document.getElementById('All');
const activeBtn = document.getElementById('Active');
const doneBtn = document.getElementById('Done');

init()
function init () { 																																								// функция инициализации сохраненных элементов списка в localStorage
	for (let i = 0; i < sessionMass.length; i++) {																									// Перебираем полученный выше массив сессии и для каждого элемента списка и обращаемся к функции, создающая <li>
		addNewTask(sessionMass[i].value, i, sessionMass[i].isDone, sessionMass[i].isImportant)																														// или ничего не делаем если loacalStorage пуст
	}
}

sumbitBtn.onclick = function (){																																	// Вешаем функцию на кнопку в которой:
  let value = newTask.value;																																			// получаем текст из поля ввода
  newTask.value = "";																																							// очищаем поле ввода
  if (value) {
  	saveOnLocalStorage (value);																																		// Вызываем функцию сохранения текста в localStorage
  	addNewTask(value);																																						// Если поле ввода было не пустое при нажатии кнопки, вызываем фукцию создающую <li>
  	counter ++;																																										// Увеличиваем значения счетчика, для корректной и последовательной записи или удаления следующих id объектов
  }																																			
}

function saveOnLocalStorage (text) {																															// функция сохранения в localStorage
	sessionMass.push({'id': counter, 'value': text, 'isDone' : false, 'isImportant' : false})																								// Добавляем в массив сессии объект, со счетчиком и текстом задачи
	localStorage.session = JSON.stringify(sessionMass)																							// Перезаписываем localStorage обновленным массивом
}

function addNewTask (text, i = counter, done = false, important = false) {																													// функция добавть новый элемент в список
  let li = document.createElement('li');																													// создаем элемент списка
  li.className = 'task';																																					// добавляем класс и начинку по рыбе
  li.innerHTML = `<img src="img/star_border.svg" class="star hidden">
  								<span class="task__text">${text}</span>
					        <button class="btn btn__important hidden">MARK IMPORTANT</button>
					        <button class="btn btn__delete hidden"><img src="img/Delete.png"></button>`;
  ul.appendChild(li);																																							// вызов функции удаления задачи
  let star = li.querySelector('.star');																														// ищем звезду
  let span = li.querySelector('.task__text');																									// ищем элемент списка
	let impBtn = li.querySelector('.btn__important');																								// ищем кнопку пометки важности
	let elem = sessionMass.find(item => item.id === i);
	let delBtn = li.querySelector('.btn__delete');
  li.addEventListener ('click', function(e) {
  	if (delBtn.contains(e.target)) {
  		deleteTask();
  	} else if (impBtn.contains(e.target)) {
  		importantTask ();
  		(elem.isImportant === false)? elem.isImportant = true : elem.isImportant = false;										// меняем значение объекта в массие сессии 			
  	}	else if (li.contains(e.target) && !impBtn.contains(e.target)) {
  		doneTask();
  		(elem.isDone === false)? elem.isDone = true : elem.isDone = false;																// меняем значение объекта в массие сессии
  	}
  	localStorage.session = JSON.stringify(sessionMass);
  });
  
  function doneTask () {																																					// функция выполненной задачи
		span.classList.toggle('strike');																														// при нажатии на элемент спика(если это не кнопка "сделать важной") переключаем класс элемента
		li.classList.toggle('done');
	};

	function deleteTask () {																																			// функция удалить задачу
		li.remove();																																									// удаляем сам элемент
		sessionMass.splice(sessionMass.findIndex(item => item.id == i), 1);														// находим в массиве сессии по id объект соответствующий элементу списка и удаляем его
		for (let index = i; index < sessionMass.length; index++) {																		// перебираем массив, чтобы поправить id оставшихся объектов (чтоб шли по порядку)
			sessionMass[index].id = index;
		};
		counter --;																																										// уменьшаем счетчик, для корректной и последовательной записи или удаления следующих id объектов
	};

	function importantTask () {	
		star.classList.toggle('hidden');																															// переключаем класс звезды
		span.classList.toggle('task_important');																											// переключаем класс элемента
		impBtn.classList.toggle('btn__important_noActive');																						// переключаем класс кнопки
		(impBtn.innerHTML === 'MARK IMPORTANT')? impBtn.innerHTML = 'NOT IMPORTANT' : impBtn.innerHTML = 'MARK IMPORTANT';	// переключаем текст кнопки
	};

	if (done === true) doneTask();
	if (important === true) importantTask();
	if (doneBtn.classList.contains('active_sort') && done === false) li.classList.add('hidden');
} 

sort.addEventListener('click', function(e) {
	for (let item of sortItems) {
		item.classList.remove('active_sort');
	};
	let lies = document.querySelectorAll('li');
	if (allBtn.contains(e.target)) {
		allBtn.classList.add('active_sort');
		for (let li of lies) {
			li.classList.remove('hidden');
		}
	} else if (activeBtn.contains(e.target)) {
		activeBtn.classList.add('active_sort');
		for (let li of lies) {
			hidden(li, activeBtn)
			if (li.classList.contains('done')) li.classList.add('hidden');
		}
	} else if (doneBtn.contains(e.target)) {
		doneBtn.classList.add('active_sort');
		for (let li of lies) {
			hidden(li, doneBtn)
			if (!li.classList.contains('done')) li.classList.add('hidden');
		}
	}

	function hidden(li, btn) {
		li.classList.remove('hidden');
		li.onclick = function(e) {
			if (!li.querySelector('.btn__important').contains(e.target) && btn.classList.contains('active_sort')) li.classList.add('hidden');
		}
	}
})

search.addEventListener('keyup', function(event) {
	if (event.keyCode == 13) {
		let value = search.value;																																		// получаем текст из поля поиска
  	search.value = "";																																							// очищаем поле ввода
  	if (value) {
  		let lies = document.querySelectorAll('li');
  		for (let item of sortItems) {
				item.classList.remove('active_sort');
			};
			allBtn.classList.add('active_sort');
  		for (let li of lies) {
				li.classList.remove('hidden');
				if (li.querySelector('span').textContent !== value) li.classList.add('hidden');
			}																																								
  	}
	}
})
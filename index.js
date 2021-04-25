const newTask = document.querySelector('.input__task'); 																						// поле ввода новой задачи
const search = document.querySelector('.header__search');																						// поле ввода поиска
const sumbitBtn = document.querySelector('.btn__add'); 																							// кнопка добавить задачу
const ul = document.querySelector('.task__list'); 																									// список куда будут добавлены задачи
let sessionMass = JSON.parse(localStorage.getItem('session')) || []; 																// Получаем массив сессии из сохраненных элементов списка в localStorage или же пустой массив
let counter = sessionMass.length; 																																	// счетчик для id пунктов, присваиваем длинну массива чтоб не повторяться и продолжить счет

const sort = document.querySelector('.sort');																												// блок кнопок сортировки
const sortItems = document.querySelectorAll('.sort__item');																					// кнопки сортировки
const allBtn = document.getElementById('All');																											// кнопка сортировки - "все"
const activeBtn = document.getElementById('Active');																								// кнопка сортировки - "активные"
const doneBtn = document.getElementById('Done');																										// кнопка сортировки - "выполненные"

init()
function init () { 																																									// функция инициализации сохраненных элементов списка в localStorage
	for (let i = 0; i < sessionMass.length; i++) {																										// Перебираем полученный выше массив сессии и для каждого элемента списка и обращаемся к функции, создающая <li>
		addNewTask(sessionMass[i].value, i, sessionMass[i].isDone, sessionMass[i].isImportant)					// или ничего не делаем если loacalStorage пуст
	}
}

sumbitBtn.onclick = function (){																																		// Вешаем функцию на кнопку в которой:
  let value = newTask.value;																																				// получаем текст из поля ввода
  newTask.value = "";																																								// очищаем поле ввода
  if (value) {																																											// Если поле ввода было не пустое:
  	saveOnLocalStorage (value);																																			// Вызываем функцию сохранения текста в localStorage
  	addNewTask(value);																																							// вызываем фукцию создающую <li>
  	counter ++;																																											// Увеличиваем значения счетчика, для корректной и последовательной записи или удаления следующих id объектов
  }																																			
}

function saveOnLocalStorage (text) {																																// функция сохранения в localStorage
	sessionMass.push({'id': counter, 'value': text, 'isDone' : false, 'isImportant' : false})					// Добавляем в массив сессии объект, со счетчиком, текстом задачи и двумя свойствами
	localStorage.session = JSON.stringify(sessionMass)																								// Перезаписываем localStorage обновленным массивом
}

function addNewTask (text, i = counter, done = false, important = false) {													// функция добавть новый элемент в список
  let li = document.createElement('li');																														// создаем элемент списка
  li.className = 'task';																																						// добавляем класс и начинку по рыбе
  li.innerHTML = `<img src="img/star_border.svg" class="star hidden">
  								<span class="task__text">${text}</span>
					        <button class="btn btn__important hidden">MARK IMPORTANT</button>
					        <button class="btn btn__delete hidden"><img src="img/Delete.png"></button>`;
  ul.appendChild(li);																																								// вызов функции удаления задачи
  let star = li.querySelector('.star');																															// звезда
  let span = li.querySelector('.task__text');																												// блок текста задачи
	let impBtn = li.querySelector('.btn__important');																									// кнопка пометки важности
	let elem = sessionMass.find(item => item.id === i);																								// находим данную задаучу в массиве сессии
	let delBtn = li.querySelector('.btn__delete');																										// кнока удаления
  li.addEventListener ('click', function(e) {																												// обработчик событий
  	if (delBtn.contains(e.target)) {																																// если клик по кнопке удалить
  		deleteTask();																																									// вызываем функцию удаления
  	} else if (impBtn.contains(e.target)) {																													// если клик по кнопке важности
  		importantTask ();																																							// вызываем функцию важности
  		(elem.isImportant === false)? elem.isImportant = true : elem.isImportant = false;							// меняем значение объекта в массие сессии 			
  	}	else if (li.contains(e.target) && !impBtn.contains(e.target)) {																// если клик по задаче
  		doneTask();																																										// вызываем функцию вполненной задачи
  		(elem.isDone === false)? elem.isDone = true : elem.isDone = false;														// меняем значение объекта в массие сессии
  	}
  	localStorage.session = JSON.stringify(sessionMass);																							// после любого действия перезаписываем loaclStorage
  });
  
  function doneTask () {																																						// функция выполненной задачи
		span.classList.toggle('strike');																																// при нажатии на элемент спика(если это не кнопка "сделать важной") переключаем класс элемента
		li.classList.toggle('done');																																		// переключаем пустой класс элемента списка, для возможности сортировки 
	};

	function deleteTask () {																																					// функция удалить задачу
		li.remove();																																										// удаляем сам элемент
		sessionMass.splice(sessionMass.findIndex(item => item.id == i), 1);															// находим в массиве сессии по id объект соответствующий элементу списка и удаляем его
		for (let index = i; index < sessionMass.length; index++) {																			// перебираем массив, чтобы поправить id оставшихся объектов (чтоб шли по порядку)
			sessionMass[index].id = index;
		};
		counter --;																																											// уменьшаем счетчик, для корректной и последовательной записи или удаления следующих id объектов
	};

	function importantTask () {																																				// функция важности
		star.classList.toggle('hidden');																																// переключаем класс звезды
		span.classList.toggle('task_important');																												// переключаем класс элемента
		impBtn.classList.toggle('btn__important_noActive');																							// переключаем класс кнопки
		(impBtn.innerHTML === 'MARK IMPORTANT')? impBtn.innerHTML = 'NOT IMPORTANT' : impBtn.innerHTML = 'MARK IMPORTANT';	// переключаем текст кнопки
	};

	if (done === true) doneTask();																																		// при повторном открытии сайта и отрисовки массива сессии, если у задачи было свойство выполненной, реализуем её
	if (important === true) importantTask();																													// аналогично важности
	if (doneBtn.classList.contains('active_sort') && done === false) li.classList.add('hidden');			// при добавлении новой задачи и активной вкладки сортировки Done сразу прячем её, чтоб невыполненная задача не отображдалась в выполненных 
} 

sort.addEventListener('click', function(e) {																												// обработчик кликов по блоку сортировки
	for (let item of sortItems) {
		item.classList.remove('active_sort');																														// убираем у всех кнопок сортировки класс "активный"
	};
	let lies = document.querySelectorAll('li');																												// список всех задач
	if (allBtn.contains(e.target)) {																																	// клик по кнопке all
		allBtn.classList.add('active_sort');																														// добавляем класс "активный" кнопке all
		for (let li of lies) {																																					// перебираем задачи
			li.classList.remove('hidden');																																// у всех задач убираем класс "скрыть"
		}
	} else if (activeBtn.contains(e.target)) {																												// клик по кнопке Active
		activeBtn.classList.add('active_sort');																													// добавляем класс "активный" кнопке Active
		for (let li of lies) {																																					// перебираем задачи
			hidden(li, activeBtn)																																					// вызов функции спрятать задачу при клике на саму задачу
			if (li.classList.contains('done')) li.classList.add('hidden');																// прячем задачи не отностящиеся к данной сортировке
		}
	} else if (doneBtn.contains(e.target)) {																													// клик по кнопке Done
		doneBtn.classList.add('active_sort');																														// добавляем класс "активный" кнопке Done
		for (let li of lies) {																																					// перебираем задачи
			hidden(li, doneBtn)																																						// вызов функции спрятать задачу при клике на саму задачу
			if (!li.classList.contains('done')) li.classList.add('hidden');																// прячем задачи не отностящиеся к данной сортировке
		}
	}

	function hidden(li, btn) {																																				// функция спрятать задчу
		li.classList.remove('hidden');																																	// удаляем класс спрятать у всех задач, чтоб при переключени и кнопок сортировки они отображались корректно
		li.onclick = function(e) {																																			// при клике на задачу
			if (!li.querySelector('.btn__important').contains(e.target) && btn.classList.contains('active_sort')) li.classList.add('hidden'); // прячем задачу не отностящуюся к данной сортировке
		}
	}
})
	
search.addEventListener('keyup', function(event) {																									// функция поиска
	if (event.keyCode == 13) {																																				// при нажатии Enter
		let value = search.value;																																				// получаем текст из поля поиска
  	search.value = "";																																							// очищаем поле поиска
  	if (value) {																																										// если в поле поиска был текст
  		let lies = document.querySelectorAll('li');																										// все задачи
  		for (let item of sortItems) {																																	// убираем класс "активный" у кнопок сортировки
				item.classList.remove('active_sort');																												
			};
			allBtn.classList.add('active_sort');																													// делаем активным кнопку All
  		for (let li of lies) {																																				// перебираем задачи
				li.classList.remove('hidden');																															// удаляем класс "спрятать" если такой был
				if (li.querySelector('span').textContent.toLowerCase().indexOf(value.toLowerCase()) < 0) li.classList.add('hidden'); // ищем в тексте задач соответствие поиску и прячем задачу, если соттветсвия нет
			}																																								
  	}
	}
})
// HTML
const container = document.querySelector("#image-container"); // Контейнер для отображения текущего изображения
const scoreDisplay = document.querySelector("#score"); // Элемент для отображения текущего счета
let score = 0; // Начальный счет

let images = JSON.parse(localStorage.getItem("images")) || []; // Массив изображений с локального хранилища

if (images.length === 0) {
	images = Array.from({ length: 300 }, (_, i) => ({
		src: `img/${i + 1}.jpg`,
		comment: `Комментарий к изображению ${i + 1}`
	})).filter(image => imageExists(image.src)); // Проверяем, существует ли изображение
	saveCommentsToStorage(); // Сохраняем массив изображений
}

let currentImageIndex = 0; // Индекс текущего изображения
let commentVisible = true; // Флаг для отображения комментария

function saveCommentsToStorage() {
	localStorage.setItem("images", JSON.stringify(images)); // Сохраняем комментарии в локальное хранилище
}

async function imageExists(url) {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok; // Проверяем, существует ли файл
	} catch {
		return false;
	}
}

async function loadCurrentImage() {
	if (currentImageIndex < images.length) { // Проверяем, есть ли еще изображения
		container.style.backgroundImage = `url(${images[currentImageIndex].src})`; // Устанавливаем изображение в качестве фона контейнера
		container.setAttribute("data-comment", images[currentImageIndex].comment); // Устанавливаем комментарий как атрибут контейнера
		let commentElement = document.querySelector("#image-comment"); // Элемент для отображения комментария

		if (!commentElement) {
			commentElement = document.createElement("div"); // Создаем элемент для комментария
			commentElement.id = "image-comment"; // Устанавливаем ID элемента
			const inputElement = document.createElement("input"); // Создаем поле ввода
			inputElement.type = "text"; // Устанавливаем тип поля
			inputElement.value = images[currentImageIndex].comment; // Устанавливаем текст комментария
			inputElement.addEventListener("input", (e) => {
				images[currentImageIndex].comment = e.target.value; // Обновляем комментарий в массиве
				saveCommentsToStorage(); // Сохраняем изменения в локальное хранилище
			});
			commentElement.appendChild(inputElement); // Добавляем поле ввода в элемент комментария
			container.parentNode.insertBefore(commentElement, container.nextSibling); // Добавляем элемент под контейнером
		} else {
			const inputElement = commentElement.querySelector("input");
			inputElement.value = images[currentImageIndex].comment; // Обновляем текст поля ввода
		}

		document.querySelector("#toggle-comment").textContent = commentVisible ? "Скрыть комментарий" : "Показать комментарий";
		document.querySelector("#image-comment").style.display = commentVisible ? "block" : "none"; // Управляем видимостью комментария
	} else {
		container.innerHTML = "<h2>Игра окончена</h2><button id='restart-button'>Играть заново</button>"; // Выводим сообщение, если изображения закончились
		document.querySelector("#restart-button").addEventListener("click", restartGame); // Добавляем обработчик для кнопки "Играть заново"
	}
}

function toggleCommentVisibility() {
	commentVisible = !commentVisible; // Переключаем состояние видимости комментария
	const commentElement = document.querySelector("#image-comment");
	if (commentElement) {
		commentElement.style.display = commentVisible ? "block" : "none"; // Скрываем или отображаем комментарий
	}
	const toggleButton = document.querySelector("#toggle-comment");
	if (toggleButton) {
		toggleButton.textContent = commentVisible ? "Скрыть комментарий" : "Показать комментарий"; // Обновляем текст кнопки
	}
}

function updateScore(value) {
	score += value; // Обновляем счет на указанное значение
	scoreDisplay.textContent = `Очки: ${score}`; // Обновляем отображение счета
}

function handleSwipe(direction) {
	if (direction === "up") { // Если свайп вверх
		updateScore(1); // Увеличиваем счет
	} else if (direction === "down") { // Если свайп вниз
		updateScore(-1); // Уменьшаем счет
	}
	currentImageIndex++; // Переходим к следующему изображению
	loadCurrentImage(); // Загружаем следующее изображение
}

function restartGame() {
	score = 0; // Сбрасываем счет
	currentImageIndex = 0; // Сбрасываем индекс изображения
	scoreDisplay.textContent = `Очки: ${score}`; // Обновляем отображение счета
	loadCurrentImage(); // Загружаем первое изображение
}

function resetGame() { // Функция для сброса игры
	score = 0; // Сбрасываем счет
	currentImageIndex = 0; // Сбрасываем индекс изображения
	scoreDisplay.textContent = `Очки: ${score}`; // Обновляем отображение счета
	loadCurrentImage(); // Загружаем первое изображение
}

// Добавляем кнопку сброса
const resetButton = document.createElement("button"); // Создаем кнопку
resetButton.textContent = "Сбросить игру"; // Устанавливаем текст кнопки
resetButton.addEventListener("click", resetGame); // Привязываем обработчик события
scoreDisplay.parentNode.insertBefore(resetButton, scoreDisplay.nextSibling); // Вставляем кнопку после элемента отображения счета

// Добавляем кнопку переключения комментария
const toggleCommentButton = document.createElement("button"); // Создаем кнопку
toggleCommentButton.id = "toggle-comment"; // Устанавливаем ID кнопки
toggleCommentButton.textContent = "Скрыть комментарий"; // Устанавливаем текст кнопки
toggleCommentButton.addEventListener("click", toggleCommentVisibility); // Привязываем обработчик события
scoreDisplay.parentNode.insertBefore(toggleCommentButton, resetButton.nextSibling); // Вставляем кнопку после кнопки сброса

// Swipe detection
let startY; // Начальная координата Y для отслеживания свайпа

container.addEventListener("touchstart", (event) => {
	startY = event.touches[0].clientY; // Сохраняем начальную позицию касания
});

container.addEventListener("touchend", (event) => {
	const endY = event.changedTouches[0].clientY; // Получаем конечную позицию касания
	const diffY = startY - endY; // Вычисляем разницу по Y

	if (Math.abs(diffY) > 50) { // Проверяем, превышает ли движение порог для свайпа
		if (diffY > 0) { // Если движение вверх
			handleSwipe("up"); // Обрабатываем свайп вверх
		} else { // Если движение вниз
			handleSwipe("down"); // Обрабатываем свайп вниз
		}
	}
});

// Блокировка обновления страницы свайпом вниз
window.addEventListener("touchmove", (event) => {
	if (event.touches[0].clientY > startY) {
		event.preventDefault(); // Предотвращаем стандартное поведение
	}
}, { passive: false });

// Initialize
loadCurrentImage(); // Загружаем первое изображение при старте

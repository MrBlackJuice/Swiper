let images = document.querySelectorAll('.infinity-slider img');  //подключаемся к картинкам
let current = 0;

function slider() {   //будет скрывать картинки
	for (let i = 0; i < images.length; i++) {
		images[i].classList.add('opacity0'); //добавляем класс opacity0 для скрывания элемента      

	}
	images[current].classList.remove('opacity0');
}
slider();

// document.querySelector('.infinity-slider').onclick = slider; // вешаем событие на блок картинок
function swipeRigth() {
	if (current - 1 == -1) {
		current = images.length - 1;
	}
	else {
		current--;
	}
	slider();


};

function swipeLeft() {
	if (current + 1 == images.length) {
		current = 0;
	}
	else {
		current++;
	}
	slider();

};



///////////////////
document.addEventListener('touchstart', handlTouchStart, false); //событие тачстарт срабатывает при нажатии мыши
document.addEventListener('touchmove', handlTouchMove, false);

const logBlock = document.querySelector('.log-block'); // блок для вывода информации

let x1 = null;
let y1 = null;

function handlTouchStart(event) {
	const firstTouch = event.touches[0];
	x1 = firstTouch.clientX; // цепляемся к координатам событий
	y1 = firstTouch.clientY;
	// console.log(x1, y1);
}

function handlTouchMove(event) {
	if (!x1 || !y1) { //если координаты не изменились
		return false;
	}
	let x2 = event.touches[0].clientX;
	let y2 = event.touches[0].clientY;
	//console.log(x2, y2);
	let xDiff = x2 - x1; //определяем вектор движения
	let yDiff = y2 - y1;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {  //опредеяем по модулю движение более горизонтальное или вертикальное
		if (xDiff > 0) {
			logBlock.textContent = ('right');		//движение лево-право
			swipeRigth();

		}
		else {
			logBlock.textContent = ('left');
			swipeLeft();
		}
	}
	else {
		if (yDiff > 0) logBlock.textContent = ('down');		//движение верх-низ
		else logBlock.textContent = ('top');
	}
	x1 = null;
	y1 = null;
}
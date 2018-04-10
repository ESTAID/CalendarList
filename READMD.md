# CalendarWithTodolist
> 객체를 활용하여 달력과 투두리스트 구현하기


![](header.png)

## About Project

달력 객체와 투두리스트 객체를 만들어 달력과 투두리스트 기능을 만들었습니다.

해당 일을 클릭하여 리스트를 작성하면 리스트가 추가됩니다.

나아가, 투두리스트에서 드래그 & 드롭 기능을 추가하여 리스트 위치 변경, 리스트 제거 기능을 만들었습니다.


## Calendar Object

#### 객체 정의
````
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var theDate = new Date();

  var DateObject = function DateObject(theDate) {
    this.theDay = theDate.getDate();
    this.dayName = dayNames[theDate.getDay()];
    this.theMonth = monthNames[theDate.getMonth()];
    this.theYear = theDate.getFullYear();
    this.daysInMonth = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 0).getDate(); 
    this.firstDayOfMonth = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay(); 
  };
````
- ```theDate```변수에 Date 객체를 담아 인자값으로 넘깁니다.

- 해당 값은 전역에 선언하고 달이 바뀔때마다 새로운 객체를 생성합니다.

- ```DateObject```객체안에는 년,월,일 변수와 그 변수를 활용하여 만든 마지막날, 첫날 변수가 있습니다.

- ```new Date(year, month, 1 or 0).getDate() or .getDay()``` 을 넣으면 해당 날의 마지막 혹은 첫날이 구해집니다.

#### renderCalendar 함수 정의

````
function renderCalendar(leftTargetElem, rightTargetElem) {
  function drawMonthContents() {
	...
	}
	
	currentDate = new DateObject(theDate);

	var monthContentsRenderTarget = document.querySelector(rightTargetElem);
	monthContentsRenderTarget.innerHTML = "";
	var monthHeaderRenderTarget = document.querySelector(leftTargetElem);
	monthHeaderRenderTarget.innerHTML = "";

	var dayNameElem = document.createElement("div");
	dayNameElem.className = "day-header";
	var dayNameNode = document.createTextNode(currentDate.dayName);
	dayNameElem.appendChild(dayNameNode);
	monthHeaderRenderTarget.appendChild(dayNameElem);

	var dayNumber = document.createElement('div');
	dayNumber.className = "day-number";
	var dayNumNode = document.createTextNode(currentDate.theDay);
	dayNumber.appendChild(dayNumNode);
	monthHeaderRenderTarget.appendChild(dayNumber);

	var monthOfDate = document.querySelector('.month-of-date');
	monthOfDate.textContent = `${currentDate.theMonth} ${currentDate.theYear}`;

	drawMonthContents();

	monthContentsRenderTarget.addEventListener('click', changePickerDate);	
}
````

- 큰 숫자와 요일이 나오는 왼쪽 엘리먼트과 달력이 나오는 오른쪽엘리먼트는 나눴습니다.

- ```drawMonthContents``` 는 달력안에 6 x 7 테이블을 만들어주는 함수입니다.

- renderCalendar가 호출될때마다 ```currentDate```에 새로운 DateObject가 생성됩니다.

#### renderCalendar 함수 선언
````
renderCalendar(".left-content", ".month-contents");
````

#### 이벤트핸들러 monthClickHandler 함수 정의
````
function monthClickHandler(ev) {
    if (ev.target.textContent === '<') {
      goToMonth(false); 
    } else if (ev.target.textContent === '>') {
      goToMonth(true); 
    }
  }
````
- 이전달(<)과 다음달(>)의 구분은 true / false로 나눴습니다.

#### goTomonth 함수 정의
````
  function goToMonth(isDirection) {
    if (isDirection == false) {
      theDate = new Date(theDate.getFullYear(), theDate.getMonth() - 1, 1);
    } else {
      theDate = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 1);
    }

    document.querySelector('.month-contents').removeEventListener('click', changePickerDate);
    renderCalendar(".left-content", ".month-contents");
  }
````
- isDirection 값에 따라 전역에 선언된 ```theDate```의 값이 달라집니다.
- 중복 클릭을 방지하기위해 changePickerDate 클릭 이벤트 핸들러를 지웠습니다.

#### changePickerDate 함수 정의
````
function changePickerDate(ev) {
    if (ev.target.textContent) {
      var pickDateElement = document.querySelector('.pickDate');
      pickDateElement.classList.remove('pickDate');
      ev.target.classList.add('pickDate');
      findPickDayValue = ev.target.classList[0].split('');
      findPickDayValue = findPickDayValue[findPickDayValue.length - 1];
      document.querySelector('.day-header').textContent = dayNames[findPickDayValue];
      document.querySelector('.day-number').textContent = ev.target.textContent;

      var pickerDay = parseInt(document.querySelector('.day-number').textContent);
      currentTodoList = new TodoObject(currentDate.theYear, currentDate.theMonth, pickerDay);
      getCurrentTodoList(currentTodoList.pickerYear, currentTodoList.pickerMonth, currentTodoList.pickerDate);
    }
  }
````
- 날짜가 바뀔때마다 전역에 선언된 ```currentTodoList```값도 초기화됩니다.
## Todolist Oject
#### 객체 정의
````
var todoDataStore = [];

  var TodoObject = function TodoObject(pickerYear, pickerMonth, pickerDate) {
    this.dataStore = [];
    this.pickerYear = pickerYear;
    this.pickerMonth = pickerMonth;
    this.pickerDate = pickerDate;
    this.todoDataStorePos = 0;
  };
````
- 전역에 ```todoDataStore```를 선언해 리스트를 관리합니다.
- pickerYear, pickerMonth, pickerDate는 현재 날짜의 값을 참조합니다.

#### 객체 선언
````
var currentTodoList = new TodoObject(currentDate.theYear, currentDate.theMonth, currentDate.theDay);
todoDataStore.push(currentTodoList);
````
- 전역에 선언하여 달력에서 changePickerDate 함수가 호출될때 초기화합니다.

#### appendList 함수 정의
````
  function appendList(todoOjbect, todoContent, isObj) {
    var todoCountInnerElement = document.querySelector('.todo-count-inner');
    for(var i = 0; i < todoDataStore.length; i++) {
      if(todoDataStore[i].pickerYear === todoOjbect.pickerYear && todoDataStore[i].pickerMonth === todoOjbect.pickerMonth && todoDataStore[i].pickerDate === todoOjbect.pickerDate) {
        todoDataStore[i].dataStore.push(todoContent);
        todoCountInnerElement.innerHTML = todoDataStore[i].dataStore.length;
        isObj = true;
        currentTodoList.todoDataStorePos = i;
      }
    }

    if(!isObj) {
      todoDataStore.push(currentTodoList);
      currentTodoList.todoDataStorePos = todoDataStore.length - 1;
      todoDataStore[currentTodoList.todoDataStorePos].dataStore.push(todoContent);
      todoCountInnerElement.innerHTML = todoDataStore[currentTodoList.todoDataStorePos].dataStore.length;
      
    }
  }
````
- ```todoDataStore```에 값이 있는 경우 데이터를 화면에 보여줍니다.

- 없는 경우엔 처음 추가된 값을 화면에 보여줍니다.

#### getCurrentTodoList 함수 정의
````
  function getCurrentTodoList(year, month, date) {
    var todoListElement = document.querySelector('.todo-list');
    todoListElement.textContent = "";
    var todoCountInnerElement = document.querySelector('.todo-count-inner');
    todoCountInnerElement.textContent = 0;
    
    for (var i = 0; i < todoDataStore.length; i++) {
      if (todoDataStore[i].pickerYear === year && todoDataStore[i].pickerMonth === month && todoDataStore[i].pickerDate === date) {
        for(var j = 0; j < todoDataStore[i].dataStore.length; j++) {
          todoListElement.appendChild(todoDataStore[i].dataStore[j]);
        }
        getTodoCountInner();
      }
    }
  }
````
- 현재 가지고 있는(todoDataStore에 저장된) todolist를 화면에 보여줍니다.

#### uploadData 함수 정의
````
function uploadData(ev) {
    if (ev.target.value != "" && ev.keyCode === 13) {
      var listElement = document.createElement('li');
      var viewElement = document.createElement('div');
      viewElement.className = 'view';
      var toggleElement = document.createElement('input');
      toggleElement.type = 'checkbox';
      toggleElement.className = 'toggle';
      toggleElement.addEventListener('click', addCompletedClass);

      var contentElement = document.createElement('label');
      var draggedTargetElement;
      contentElement.draggable = true;
      contentElement.textContent = ev.target.value;
      contentElement.addEventListener('dragstart', dragStart);
      contentElement.addEventListener('dragover', dragOver);
      contentElement.addEventListener('dragenter', dragEnter);
      contentElement.addEventListener('dragleave', dragLeave);
      contentElement.addEventListener('drop', dropElement);
      contentElement.addEventListener('dragend', dragEnd);

      var deleteElement = document.createElement('button');
      deleteElement.className = 'destroy';
      deleteElement.addEventListener('click', deleteEvent);

      function deleteEvent() {
			...
      }

      listElement.appendChild(viewElement);
      viewElement.appendChild(toggleElement);
      viewElement.appendChild(contentElement);
      viewElement.appendChild(deleteElement);

      document.querySelector('.todo-list').appendChild(listElement);
      appendList(currentTodoList, listElement, false);
      ev.target.value = "";
    }
  }
````
- 각종 리스트에 필요한 이벤트들을 추가해줍니다.
- 리스트가 추가될때 드래그 & 드롭 이벤트도 추가해줍니다.

### CalendarWithTodolist를 구현하며 느낀점
- Date 함수의 활용
  - 최초에 Date 함수를 한번만 정의 후 검색을 통해 Date함수 인자값으로 특정 년, 월, 일을 넣으면 관련된 함수들을 모두 사용할 수 있었습니다.

- 생성자함수의 활용
  - 하나의 객체값을 참조하지않고 달력의 이동이 있을때마다 새로운 객체를 만들어 재사용할 수 있었습니다.
	
- 이전 달, 다음 달 클릭 이벤트
  - 이전, 다음 달을 비교하는 함수(goToMonth)를 선언해 호출할때마다 인자값으로 Boolean변수를 써 전역변수 ```theDate```의 변경함으로써 코드의 길이을 줄일 수 있었다.
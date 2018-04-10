(function vanillaJsCalendar() {

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

  var currentDate = new DateObject(theDate); 

  var todoDataStore = [];

  var TodoObject = function TodoObject(pickerYear, pickerMonth, pickerDate) {
    this.dataStore = [];
    this.pickerYear = pickerYear;
    this.pickerMonth = pickerMonth;
    this.pickerDate = pickerDate;
    this.todoDataStorePos = 0;
  };

  var currentTodoList = new TodoObject(currentDate.theYear, currentDate.theMonth, currentDate.theDay);
  todoDataStore.push(currentTodoList);

  function renderCalendar(leftTargetElem, rightTargetElem) {
    function drawMonthContents() {
      var oneDay = "";
      for (var i = 0; i < 6; i++) {
        var calendarWeekElement = document.createElement("tr");
        calendarWeekElement.className = `calendar-week-${i+1}`;
        for (var j = 0; j < 7; j++) {
          var calendarDayElement = document.createElement("th");
          calendarWeekElement.appendChild(calendarDayElement);
          calendarDayElement.className = `calendar-cell-${j}`;
          monthContentsRenderTarget.appendChild(calendarWeekElement);

          if (!i && j === currentDate.firstDayOfMonth) {
            oneDay = 0;
          }

          if (oneDay !== currentDate.daysInMonth && oneDay !== "") {
            oneDay++;
            if (oneDay === currentDate.theDay) {
              calendarDayElement.classList.add("pickDate");
            }
            calendarDayElement.textContent = oneDay;
          } else {
            oneDay = "";
          }
        }
      }
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

  renderCalendar(".left-content", ".month-contents");


  function monthClickHandler(ev) {
    if (ev.target.textContent === '<') {
      goToMonth(false); 
    } else if (ev.target.textContent === '>') {
      goToMonth(true); 
    }
  }
  var prevMonthSpan = document.querySelector('.prev-arrow');
  prevMonthSpan.addEventListener('click', monthClickHandler);

  var nextMonthSpan = document.querySelector('.next-arrow');
  nextMonthSpan.addEventListener('click', monthClickHandler);

  function goToMonth(isDirection) {
    if (isDirection == false) {
      theDate = new Date(theDate.getFullYear(), theDate.getMonth() - 1, 1);
    } else {
      theDate = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 1);
    }

    document.querySelector('.month-contents').removeEventListener('click', changePickerDate);
    renderCalendar(".left-content", ".month-contents");
  }

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

  // todolist.js
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
        listElement.remove();
        for(var i = 0; i < currentTodoList.dataStore.length; i++) {
          if(currentTodoList.dataStore[i].innerText === contentElement.textContent) {
            currentTodoList.dataStore.splice(currentTodoList.dataStore[i], 1);
          }
        }
        getTodoCountInner();
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

  function dragStart(ev) {
    draggedTargetElement = ev.target.parentElement.parentElement;
    draggedTargetElement.classList.add('is-dragged');
  }

  function dragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    ev.target.style.cursor = '';
    if (ev.x > 700) {
      ev.target.style.cursor = "url(https://findicons.com/files/icons/753/gnome_desktop/64/gnome_edit_delete.png), auto";
    } else {
      ev.target.style.cursor = '';
    }
  }

  function dragEnter(ev) {
    var elem = ev.target.parentElement.parentElement;
    elem.style.borderBottom = "1px solid aquamarine";
  }

  function dragLeave(ev) {
    var elem = ev.target.parentElement.parentElement;
    elem.style.border = '';
  }

  function dragEnd(ev) {
    var elem = ev.target.parentElement.parentElement;
    elem.classList.remove('is-dragged');
    ev.target.style.cursor = '';
    if (ev.x > 700) {
      elem.remove();
      for(var i = 0; i < currentTodoList.dataStore.length; i++) {
        if(currentTodoList.dataStore[i].innerText === elem.textContent) {
          currentTodoList.dataStore.splice(currentTodoList.dataStore[i], 1);
        }
      }
      getTodoCountInner();
    }
  }

  function dropElement(ev) {
    ev.preventDefault();
    var elem = ev.target.parentElement.parentElement;
    elem.style.border = '';
    if (elem.previousElementSibling) {
      document.querySelector('.todo-list').insertBefore(draggedTargetElement, elem.nextSibling);
    } else {
      document.querySelector('.todo-list').insertBefore(draggedTargetElement, elem);
    }
  }

  function addCompletedClass(ev) {
    if(ev.target.checked) {
      ev.target.parentNode.parentNode.classList.add('completed');
    } else {
      ev.target.parentNode.parentNode.classList.remove('completed');
    }
    getTodoCountInner();
  }

  function getTodoCountInner() {
    var notChecked = todoDataStore[currentTodoList.todoDataStorePos].dataStore.length;
    var checked = document.querySelectorAll('.completed').length;
    document.querySelector('.todo-count-inner').innerHTML = notChecked - checked;
  }

  document.querySelector('.filters').addEventListener('click', function (ev) {
    var todoListElement = document.querySelector('.todo-list');
    if (ev.target.href) {
      var isChecked = document.querySelectorAll('.toggle');
      var location = ev.target.href.split('#');
      location = location[location.length - 1];

      if (location === "/active") {
        activeList(todoListElement, isChecked);
      } else if (location === "/completed") {
        completedList(todoListElement, isChecked);
      } else {
        resetClassList(todoListElement);
      }
    }
  });

  function activeList(parentElement, isChecked) {
    resetClassList(parentElement);
    for (var i = 0; i < isChecked.length; i++) {
      if (isChecked[i].checked) {
        isChecked[i].parentElement.parentElement.classList.add('hidden');
      }
    }
  }

  function completedList(parentElement, isChecked) {
    resetClassList(parentElement);
    for (var i = 0; i < isChecked.length; i++) {
      if (isChecked[i].checked) {
        isChecked[i].parentElement.parentElement.classList.add('completed');
      } else {
        isChecked[i].parentElement.parentElement.classList.add('hidden');
      }
    }
  }

  function resetClassList(parentElement) {
    for (var i = 0; i < parentElement.children.length; i++) {
      parentElement.children[i].className = "";
    }
  }

  document.querySelector('.new-todo').addEventListener('keypress', uploadData);
})();
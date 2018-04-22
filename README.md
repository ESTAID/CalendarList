# CalendarWithTodolist
> 객체를 활용하여 달력과 투두리스트 구현하기


![](https://github.com/Geon-wooBryanKim/CalendarList/blob/master/ui.png)

## About Project
달력과 투두리스트 웹 어플리케이션

## Installation

```
git clone REMOTE_URL

cd FILE_NAME

npm install

npm start
```
---

## Requirements
- 반응형 웹 어플리케이션입니다.
- Chorme Browser 환경을 권장합니다.

## Features
- Vanilla Javascript
- 별도의 프레임워크를 사용하지 않았습니다.
- Drag & Drop 기능(오른쪽 : 삭제 , 위/아래 : 일정 순서 변경)

## Things to do
- Window.localStorage 사용
- 버그 

## CalendarWithTodolist를 구현하며 느낀점
- Date 함수의 활용
  - 최초에 Date 함수를 한번만 정의 후 년,월,일 변경을 통한 Date 함수의 활용.

- 생성자함수의 활용
  - 하나의 객체값을 참조하지않고 달력의 이동이 있을때마다 새로운 객체를 만들어 재사용함.

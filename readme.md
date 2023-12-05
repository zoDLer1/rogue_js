<p align="center">
<h1 align="center">Rogue JS</h1>
<div align="center">Просто рогалик на javaScript.</div>
<br/>
</p>

![Screenshot_91](https://github.com/zoDLer1/rogue_js/assets/88045849/c4140f72-d54a-4482-a64b-3445397ecd8b)

## 1. Предварительные требования
Прежде чем начать, убедитесь, что у вас установлены следующие необходимые компоненты:
- [Git](https://git-scm.com/downloads)

## 2. Установка
Чтобы запустить это приложение, выполните следующие действия:
### Клонируйте репозиторий:
Откройте терминал или командную строку и клонируйте репозиторий, используя  следующую команду:
```bash
git clone https://github.com/zoDLer1/rogue_js.git
```

### 3. Запуск приложения

В папке `rogue` откройте файл `index.js` в браузере.

### 4. Игра
#### 4.1 Противники:
Каждый противник генерирует случайный маршрут патрулирования и идёт к конечной точке:
<p align='center'>
<img  src='https://github.com/zoDLer1/rogue_js/assets/88045849/8a4dfae2-91c3-4ff5-a4fd-794634c567ce'/>
</p>
По окончанию маршрута гененируется новый. Каждый ход враг сканирует пространство вокруг себя в поисках игрока:
<p align='center'>
<img src='https://github.com/zoDLer1/rogue_js/assets/88045849/f3bacd60-721f-4592-9008-eae979530e56'/>
</p>

Если игрок найден враг начинает преследовать его, выстраивая маршрут до него

<p align='center'>
<img src='https://github.com/zoDLer1/rogue_js/assets/88045849/29665a86-b926-4f2d-a526-866b4e520f1a'/>
</p>

В случае если враг достиг игрока он атакует его в определённых клетках:

<p align='center'>
<img src='https://github.com/zoDLer1/rogue_js/assets/88045849/c88a8e4c-e415-4f1d-ab80-923fac762240'/>
</p>

#### 4.2 Предметы:
Игрок может поднимать зелья (излечивает на 20 ед здоровья) и мечи (добавляет 5 урона к текущему урону)
<p align='center'>
<img src="https://github.com/zoDLer1/rogue_js/assets/88045849/b7ef6d20-33eb-4911-a3f1-ffd6c91ea834">
</p>
<p align='center'>
<img src="https://github.com/zoDLer1/rogue_js/assets/88045849/aa61407c-f882-4620-8c9c-be7df9159a3e">
</p>

#### 4.3 Игрок:
Передвижение игрока осуществляется WASD, атака на Пробел.
Игрок атакует в радиусе 1 клетки от себя по всем направлениям:

<p align='center'>
<img src='https://github.com/zoDLer1/rogue_js/assets/88045849/105df41e-c826-45db-945c-fd275142e842'/>
</p>

#### 4.4 Завершение игры:
Игра завершается если ирок мертв или убыты все противники

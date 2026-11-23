# Борис и Кристиан — задачи и commits

Това е предложено разпределение за преглед, изпълнение и проверка. Не твърди, че учениците вече са написали или тествали даден файл. Кодът е подготвен с ИИ. Всеки трябва да разбере частта си, да направи реалните проверки и да комитне през собствения си профил. Не сменяйте автора на commits, за да имитирате чужд принос.

## Борис — интерфейс, преводи и демонстрация

- Преглежда index.html и css/style.css; обяснява двата изгледа, семантичния HTML и media queries.
- Проверява и при нужда редактира преводите в js/translations.js.
- Проверява 1280/390 px, BG/EN, клавиатура и навигация; заснема истинския резултат.
- Описва проверките и собственото решение в личния раздел на WEEK_2_REPORT.

Предложен commit след реален преглед:

```sh
git add index.html css/style.css js/translations.js
git commit -m "Add responsive home and mission screens with BG/EN"
```

Втори commit след собствените проверки:

```sh
git add docs/evidence docs/TEST_RESULTS.md
git commit -m "Document desktop and mobile interface checks"
```

## Кристиан — данни, логика и Supabase

- Преглежда js/app.js, game.js, demo-data.js и supabase-client.js; обяснява как изборът се записва и как се запазва прогресът.
- Създава реалния Supabase проект, изпълнява SQL и попълва само публичните настройки.
- Проверява GET, RPC INSERT, дублиран опит и изолация между два потребителя; експортира структурата.
- Изпълнява npm test и описва резултата и собственото решение в личния раздел.

Предложен commit след реален преглед:

```sh
git add js/app.js js/game.js js/demo-data.js js/supabase-client.js js/config.js supabase scripts tests package.json .gitignore
git commit -m "Add mission logic and secured Supabase data model"
```

Втори commit след настройка и реална проверка:

```sh
git add js/config.js docs/SUPABASE_SETUP.md docs/evidence docs/TEST_RESULTS.md
git commit -m "Connect Supabase and verify persisted attempts"
```

Последното съобщение е подходящо **само след успешен реален тест**, не само след добавяне на SQL.

## Общите документи

След като първите commits са push-нати, другият прави git pull. Борис може да добави README.md, RESEARCH.md, PROJECT_PLAN.md, TECH_STACK.md и docs/SOURCES.md с `Document stage two scope and technology stack`. Кристиан добавя ER файловете, TEACHER_TEST, SUBMISSION_CHECKLIST, GITHUB_ISSUES и този файл с `Add database diagram and teacher testing guide`.

За WEEK_2_REPORT: първият добавя общата част и своя реален раздел, commit/push; вторият прави pull, попълва своя раздел и commit/push. Не променяйте едновременно едни и същи редове. За всеки раздел поставете реален commit hash/линк, не примерен.

Работете в съществуващото общо хранилище от Етап 1. Папката от Downloads е ZIP копие без .git; тя не е историята на проекта. Clone-нете общото хранилище и копирайте файловете в неговия корен. Не правете второ хранилище. Преди commit проверете `git diff --cached` и `git status`.

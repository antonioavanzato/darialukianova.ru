# Сайт «Дарья Лукьянова» — статическая версия для GitHub Pages

Сайт, перенесённый с wfolio. Три файла:

- `index.html` — разметка страницы (+ SEO-блок Schema.org в `<head>`)
- `styles.css` — все стили
- `script.js` — анимация появления при скролле

## Публикация на GitHub Pages

1. Загрузите `index.html`, `styles.css`, `script.js` в корень репозитория
   (через кнопку **Add file → Upload files** на github.com).
2. Откройте **Settings → Pages**.
3. В разделе **Build and deployment → Source** выберите **Deploy from a branch**.
4. Branch: `main`, папка: `/ (root)` → **Save**.
5. Через 1–2 минуты сайт будет доступен по адресу
   `https://<ваш-логин>.github.io/<имя-репозитория>/`.

## Что заменить перед запуском (SEO)

В `index.html`, в блоке `<script type="application/ld+json">`:

- `telephone` — реальный номер вместо `+7-XXX-XXX-XX-XX`
- `sameAs` — ссылки на соцсети / Яндекс.Карты / 2ГИС (массив `[]`)
- при необходимости — `geo`, `postalCode`, адрес

Ссылки внутри страницы (`href="https://darialukianova.com/..."`) ведут на
будущие разделы. Пока их нет — поменяйте на нужные URL или на якоря.

## Важно про картинки

Изображения сейчас грузятся с серверов wfolio (`i.wfolio.ru`). Если аккаунт
wfolio будет закрыт — фото пропадут. Рекомендуется скачать их, положить
в папку `images/` репозитория и заменить пути `src` в `index.html`.

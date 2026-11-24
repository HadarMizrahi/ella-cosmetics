# Ella Cosmetics — אתר תדמית (עמוד נחיתה)

אתר סטטי בעברית (RTL), רספונסיבי, עם תוכן שמנוהל בקובצי JSON נפרדים. מתאים ל־Cloudflare Pages.

## מבנה
- `index.html` — שלד העמוד והאזורים.
- `assets/css/style.css` — עיצוב, צבעים והתאמה למובייל.
- `assets/js/app.js` — טעינת התוכן והצגתו באתר.
- `data/site.json` — שם העסק, טקסטים, טלפון, WhatsApp, כתובת ורשתות חברתיות.
- `data/treatments.json` — כרטיסי הטיפולים.
- `data/brands.json` — שמות המותגים וקובצי הלוגו.
- `data/gallery.json` — תמונות לפני/אחרי וכותרות.
- `data/pricing.json` — המחירון.
- `assets/images/` — תמונות האתר.

## איך מעדכנים תוכן
עורכים את קובצי ה־JSON בתיקיית `data`. אין צורך לשנות את HTML או JavaScript.
שומרים על מבנה JSON תקין ועל שמות השדות הקיימים.

### הוספת תמונות
מעתיקים את התמונות לתיקיות המתאימות ומשתמשים בנתיב יחסי:
- תמונת פתיחה: `assets/images/hero/hero.jpg`
- תמונות טיפולים: `assets/images/treatments/`
- לוגואים: `assets/images/brands/`
- תמונות תוצאות: `assets/images/results/`

בתמונות לפני/אחרי יש להשתמש רק בתמונות מקוריות שהתקבל עבורן אישור פרסום. לא להשתמש בתמונות הדגמה כאילו הן תוצאות של לקוחות.

## פרטי העסק
בקובץ `data/site.json` יש לעדכן את `phone`, `whatsapp`, `address`, `instagram`, `facebook`.
מספר WhatsApp בפורמט בינלאומי עם קידומת מדינה וללא +, מקפים או רווחים. לדוגמה: `972501234567` (דוגמה בלבד).

## הרצה מקומית
מומלץ לפתוח את התיקייה ב־VS Code ולהריץ באמצעות התוסף Live Server. פתיחה ישירה של `index.html` (file://) עלולה למנוע טעינת JSON בגלל מגבלות דפדפן.

## פרסום ב־Cloudflare Pages
אם הפרויקט כבר מחובר ל־GitHub ול־Cloudflare Pages:
1. להעתיק את הקבצים לתיקיית השורש של הריפו (לצד `index.html`).
2. לבצע `git add .`
3. לבצע `git commit -m "Build cosmetics landing page"`
4. לבצע `git push`
5. Cloudflare Pages יפרוס אוטומטית את הגרסה החדשה.

ב־Cloudflare Pages לפרויקט סטטי ללא build:
- Build command: להשאיר ריק
- Build output directory: `/` או `.` לפי הגדרת הממשק

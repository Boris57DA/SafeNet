// Fictional teaching scenarios; .invalid domains cannot be real websites.
import {extraScenarios,extraChoices} from './campaign-data.js';
export const scenarios = [
  {
    id: 1,
    category: { bg: "ФИШИНГ", en: "PHISHING" },
    title: { bg: "Награда с уловка", en: "A prize with a catch" },
    description: {
      bg: "Съобщение обещава безплатни предмети за любимата ти игра. Ще разпознаеш ли измамата?",
      en: "A message promises free items for your favourite game. Can you spot the scam?",
    },
    sender: "Game Rewards",
    message: {
      bg: "Поздравления! 🎁 Спечели 5000 безплатни монети!\n\nСамо за следващите 10 минути: влез с игровия си акаунт през линка и потвърди паролата си, за да вземеш наградата.",
      en: "Congratulations! 🎁 You won 5,000 free coins!\n\nFor the next 10 minutes only: sign in with your gaming account using the link and confirm your password to claim your prize.",
    },
    fake_link: "https://game-rewards.invalid/claim",
    difficulty_level: 1,
    minutes: 2,
    icon: "◇",
  },
  {
    id: 2,
    category: { bg: "ЗАЩИТА НА АКАУНТА", en: "ACCOUNT SECURITY" },
    title: { bg: "Кодът е само за теб", en: "That code is yours" },
    description: {
      bg: "Някой се представя за поддръжка и иска твоя код за вход. Как ще защитиш акаунта си?",
      en: "Someone claims to be support and asks for your login code. How will you protect your account?",
    },
    sender: "Support Helper",
    message: {
      bg: "Здравей! Забелязахме проблем с твоя профил. Аз съм от поддръжката.\n\nИзпрати ми шестцифрения код, който току-що получи, за да не бъде блокиран акаунтът ти.",
      en: "Hi! We noticed a problem with your profile. I work for support.\n\nSend me the six-digit code you just received so your account does not get blocked.",
    },
    fake_link: "Support chat · #4821",
    difficulty_level: 1,
    minutes: 2,
    icon: "⌘",
  },
  {
    id: 3,
    category: { bg: "ОБЩУВАНЕ ОНЛАЙН", en: "ONLINE COMMUNICATION" },
    title: { bg: "Не си сам в чата", en: "You are not alone" },
    description: {
      bg: "В групов чат се появяват обиди към твой съученик. Избери действие, което наистина помага.",
      en: "A classmate is being insulted in a group chat. Choose an action that actually helps.",
    },
    sender: "Class group",
    message: {
      bg: "В групата няколко души споделят унизителна снимка на твой съученик и го обиждат.\n\n„Прати я на всички! Нека целият клас я види!“",
      en: "Several people in the group share an embarrassing photo of your classmate and insult them.\n\n“Send it to everyone! Let the whole class see it!”",
    },
    fake_link: "",
    difficulty_level: 1,
    minutes: 3,
    icon: "☏",
  },
];
export const choices = [
  {
    id: 11,
    scenario_id: 1,
    position: 1,
    text: {
      bg: "Отварям линка и въвеждам паролата си.",
      en: "Open the link and enter my password.",
    },
    is_correct: false,
    feedback: {
      bg: "Фалшивите награди могат да откраднат паролата ти. Спешният срок и непознатият адрес са предупредителни сигнали. Провери офертата през официалното приложение.",
      en: "Fake prizes can steal your password. Urgency and an unfamiliar address are warning signs. Check the offer in the official app.",
    },
  },
  {
    id: 12,
    scenario_id: 1,
    position: 2,
    text: {
      bg: "Проверявам през официалното приложение и докладвам съобщението.",
      en: "Check the official app and report the message.",
    },
    is_correct: true,
    feedback: {
      bg: "Точно така! Отвори официалното приложение самостоятелно, без подозрителния линк. Не споделяй парола и докладвай измамата.",
      en: "Exactly! Open the official app yourself without using the suspicious link. Do not share your password and report the scam.",
    },
  },
  {
    id: 13,
    scenario_id: 1,
    position: 3,
    text: {
      bg: "Препращам линка на приятел да го изпробва.",
      en: "Forward the link to a friend to try it.",
    },
    is_correct: false,
    feedback: {
      bg: "Така излагаш и приятеля си на риск. Не разпространявай подозрителни линкове. Провери източника и предупреди приятелите си.",
      en: "This puts your friend at risk too. Do not spread suspicious links. Check the source and warn your friends.",
    },
  },
  {
    id: 21,
    scenario_id: 2,
    position: 1,
    text: {
      bg: "Изпращам кода, защото е от поддръжката.",
      en: "Send the code because they work for support.",
    },
    is_correct: false,
    feedback: {
      bg: "Всеки може да се представи за поддръжка. Кодът може да позволи на измамника да влезе в акаунта ти. Не го споделяй.",
      en: "Anyone can pretend to be support. The code may let the scammer access your account. Never share it.",
    },
  },
  {
    id: 22,
    scenario_id: 2,
    position: 2,
    text: {
      bg: "Питам дали ще ми даде награда срещу кода.",
      en: "Ask for a reward in exchange for the code.",
    },
    is_correct: false,
    feedback: {
      bg: "Кодовете за вход не се разменят за награди. Прекрати разговора и потърси официалната поддръжка през приложението.",
      en: "Login codes should never be traded for rewards. End the conversation and contact official support through the app.",
    },
  },
  {
    id: 23,
    scenario_id: 2,
    position: 3,
    text: {
      bg: "Не споделям кода и проверявам през официалната поддръжка.",
      en: "Keep the code private and check with official support.",
    },
    is_correct: true,
    feedback: {
      bg: "Правилно! Кодът за вход е личен. Отвори настройките за сигурност и провери активните сесии, ако не си поискал този код.",
      en: "Correct! Your login code is private. Open your security settings and check active sessions if you did not request the code.",
    },
  },
  {
    id: 31,
    scenario_id: 3,
    position: 1,
    text: {
      bg: "Не препращам снимката, подкрепям съученика и търся доверен възрастен.",
      en: "Do not forward the photo, support my classmate and tell a trusted adult.",
    },
    is_correct: true,
    feedback: {
      bg: "Добър избор. Не разпространявай обидното съдържание. Запази доказателство, ако е безопасно, докладвай и потърси помощ от учител или родител.",
      en: "Good choice. Do not spread hurtful content. Keep evidence if it is safe, report it and ask a teacher or parent for help.",
    },
  },
  {
    id: 32,
    scenario_id: 3,
    position: 2,
    text: {
      bg: "Препращам снимката, защото всички го правят.",
      en: "Forward the photo because everyone else does.",
    },
    is_correct: false,
    feedback: {
      bg: "Препращането увеличава вредата. Подкрепи съученика, докладвай съдържанието и потърси доверен възрастен.",
      en: "Forwarding increases the harm. Support your classmate, report the content and tell a trusted adult.",
    },
  },
  {
    id: 33,
    scenario_id: 3,
    position: 3,
    text: {
      bg: "Започвам да обиждам нападателите.",
      en: "Start insulting the attackers.",
    },
    is_correct: false,
    feedback: {
      bg: "Отговорът с обиди може да задълбочи конфликта. Подкрепи пострадалия спокойно и потърси помощ, вместо да ескалираш.",
      en: "Insults can make the conflict worse. Calmly support the person being targeted and ask for help instead of escalating.",
    },
  },
];

scenarios.push(...extraScenarios);
choices.push(...extraChoices);

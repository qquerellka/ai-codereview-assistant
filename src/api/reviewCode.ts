const MOCK_COMMENTS = [
  "AI комментарий: попробуйте использовать `const` вместо `let`.",
  "AI комментарий: можно вынести эту часть кода в отдельную функцию.",
  "AI комментарий: избегайте лишних условий внутри цикла.",
  "AI комментарий: хорошая структура, но можно улучшить читаемость.",
  "AI комментарий: стоит добавить проверку на `null` перед использованием.",
  "AI комментарий: магические числа лучше выносить в константы.",
  "AI комментарий: переменная названа слишком абстрактно.",
  "AI комментарий: возможно, стоит использовать `map()` вместо `forEach`.",
  "AI комментарий: хорошо! Только можно добавить комментарии к коду.",
  "AI комментарий: подумайте о типизации аргументов."
];

export const reviewCode = async (code: string): Promise<string> => {
  // Эмуляция задержки
  await new Promise((res) => setTimeout(res, 3000));

  // Выбираем случайный комментарий
  const index = Math.floor(Math.random() * MOCK_COMMENTS.length);
  return MOCK_COMMENTS[index];
};

// export type LineComment = {
//   line: number;
//   comment: string;
// };

// export const reviewCode = async (code: string): Promise<LineComment[]> => {
//   await new Promise((res) => setTimeout(res, 1000)); // ⏳ задержка

//   const lines = code.split('\n');
//   const comments: LineComment[] = [];

//   if (lines.length >= 2) {
//     comments.push({ line: 2, comment: "Рассмотри использование const вместо let." });
//   }
//   if (lines.length >= 4) {
//     comments.push({ line: 4, comment: "Добавь проверку ошибок." });
//   }

//   return comments;
// };

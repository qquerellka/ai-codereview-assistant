export type LineComment = {
  line: number;
  comment: string;
  suggestion?: string;
  type?: "info" | "warning" | "error";
};

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const reviewCode = async (code: string): Promise<{
  choices: [
    {
      message: {
        role: "assistant";
        content: string;
      };
    }
  ];
}> => {
  await new Promise((res) => setTimeout(res, 1000));

  const lines = code.split("\n");
  const comments: LineComment[] = [];

  const suggestions = [
    "Рассмотрите использование тернарного оператора",
    "Добавьте проверку на null или undefined",
    "Разбейте длинную строку на несколько",
    "Вынесите это выражение в отдельную функцию",
    "Используйте строгую проверку (=== вместо ==)",
    "Рассмотрите использование optional chaining",
    "Добавьте JSDoc комментарий над функцией",
    "Избегайте магических чисел — введите константу",
    "Можно использовать деструктуризацию",
    "Подумайте о переименовании переменной для ясности"
  ];

  const replacementExamples = [
    { match: "var", suggest: "const" },
    { match: "==", suggest: "===" },
    { match: "!==", suggest: "!=" },
    { match: "function", suggest: "const fn = () =>" },
    { match: "&&", suggest: "?.", note: "можно использовать optional chaining" }
  ];

  const availableLines = lines.map((_, i) => i + 1);
  const shuffled = availableLines.sort(() => 0.5 - Math.random());
  const numberOfComments = Math.min(8, lines.length);

  for (let i = 0; i < numberOfComments; i++) {
    const line = shuffled[i];
    const rawLine = lines[line - 1] || "";
    const suggestionText = randomFrom(suggestions);

    let suggestion: string | undefined = undefined;
    const replacement = replacementExamples.find((r) => rawLine.includes(r.match));
    if (replacement) {
      suggestion = rawLine.replace(replacement.match, replacement.suggest);
    } else {
      suggestion = suggestionText;
    }

    comments.push({
      line,
      comment: `Комментарий к строке ${line}: ${suggestionText}.`,
      suggestion,
      type: randomFrom(["info", "warning", "error"])
    });
  }
  comments.sort((a, b) => a.line - b.line);

  return {
    choices: [
      {
        message: {
          role: "assistant",
          content: JSON.stringify({ comments })
        }
      }
    ]
  };
};

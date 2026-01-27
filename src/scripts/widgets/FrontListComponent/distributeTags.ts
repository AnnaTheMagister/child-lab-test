export const distributeTags = (tagsLength: number, maxTagsInRow: number): number[] => {
  // Вычисляем минимальное количество элементов в ряду
  const minTagsInRow = Math.ceil(maxTagsInRow / 2);

  // Если всего элементов меньше или равно максимуму, возвращаем один ряд
  if (tagsLength <= maxTagsInRow) {
    return [tagsLength];
  }

  // Вычисляем минимальное количество рядов
  const minRows = Math.ceil(tagsLength / maxTagsInRow);

  // Пробуем распределить элементы по рядам
  for (
    let rows = minRows;
    rows <= Math.ceil(tagsLength / minTagsInRow);
    rows++
  ) {
    // Пытаемся распределить элементы поровну
    const baseCount = Math.floor(tagsLength / rows);
    const remainder = tagsLength % rows;

    const distribution: number[] = [];

    // Создаем распределение
    for (let i = 0; i < rows; i++) {
      // Первые remainder рядов получают на 1 элемент больше
      distribution.push(i < remainder ? baseCount + 1 : baseCount);
    }

    // Проверяем, удовлетворяет ли распределение ограничениям
    const isValid = distribution.every(
      (count) => count >= minTagsInRow && count <= maxTagsInRow,
    );

    if (isValid) {
      return distribution;
    }
  }

  // Если не удалось найти распределение, используем жадный алгоритм
  const result: number[] = [];
  let remaining = tagsLength;

  while (remaining > 0) {
    // Пытаемся взять максимальное количество
    let count = Math.min(maxTagsInRow, remaining);

    // Если оставшихся меньше минимального, корректируем предыдущий ряд
    if (remaining - count < minTagsInRow && remaining - count > 0) {
      // Вычисляем, сколько нужно оставить для следующего ряда
      const nextRowMin = minTagsInRow;
      count = remaining - nextRowMin;
    }

    // Убедимся, что count не меньше минимального
    count = Math.max(count, Math.min(minTagsInRow, remaining));

    result.push(count);
    remaining -= count;
  }

  return result;
}


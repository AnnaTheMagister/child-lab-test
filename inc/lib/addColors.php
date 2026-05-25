<?php
/**
 * Сложение двух цветов в HEX формате
 * @param string $color1 HEX цвет (с # или без, 3 или 6 символов)
 * @param string $color2 HEX цвет
 * @return string HEX цвет в формате #RRGGBB
 */
function addColors($color1, $color2)
{
    // Очищаем цвета от #
    $color1 = ltrim($color1, '#');
    $color2 = ltrim($color2, '#');

    // Конвертируем 3-символьные HEX в 6-символьные
    if (strlen($color1) == 3) {
        $color1 = $color1[0] . $color1[0] . $color1[1] . $color1[1] . $color1[2] . $color1[2];
    }
    if (strlen($color2) == 3) {
        $color2 = $color2[0] . $color2[0] . $color2[1] . $color2[1] . $color2[2] . $color2[2];
    }

    // Разбиваем на RGB компоненты
    $r1 = hexdec($color1[0] . $color1[1]);
    $g1 = hexdec($color1[2] . $color1[3]);
    $b1 = hexdec($color1[4] . $color1[5]);

    $r2 = hexdec($color2[0] . $color2[1]);
    $g2 = hexdec($color2[2] . $color2[3]);
    $b2 = hexdec($color2[4] . $color2[5]);

    // Складываем и ограничиваем максимумом 255
    $r = min(255, $r1 + $r2);
    $g = min(255, $g1 + $g2);
    $b = min(255, $b1 + $b2);

    // Формируем HEX
    return sprintf('#%02x%02x%02x', $r, $g, $b);
}
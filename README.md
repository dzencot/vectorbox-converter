[![Code
Climate](https://lima.codeclimate.com/github/dzencot/vectorbox-converter/badges/gpa.svg)](https://lima.codeclimate.com/github/dzencot/vectorbox-converter)
[![Build
Status](https://travis-ci.org/dzencot/vectorbox-converter.svg?branch=master)](https://travis-ci.org/dzencot/project-lvl3-s71)
# VECTORBOX CONVERTER #
## RUS: ##
Конвертер плейлистов для системы сетевого вещания VECTORBOX в региональных
подразделениях телеканала.
## Usage: ##
```
  Usage: converter [options] <playlist> <blocks> <output>

  Generate plx file for V-BOX.

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --playlist [path]  playlist file
    -b, --blocks [path]    regional blocks file
    -o, --output [path]    output file
    -c, --config [path]    config file
```
## Config: ##
```
  * "LivePlayList" - настройки сетевого плейлиста:
    - "TimeColumn" - столбец содержащий время выхода в эфир("A");
    - "NameColumn" - столбец содержащий название передачи("B");
    - "DurationColumn" - столбец содержащий хронометраж ("C");
    - "ColorRegRec" - цвет определения региональной линии - фон названия передачи("00FF00");
    - "Offset" - поправка эфира, не может быть отрицательной("00:00:00:00").
  * "RegionalBlocks" - настройки региональной монтажки(блоки):
    - "NameSheet" - имя листа в таблице Excel("Лист1");
    - "NumberBlockColumn" - столбец содержащий номер блока("E");
    - "NumberRolickColumn" - столбец содержащий номер ролика("A");
    - "IdRolickColumn" - столбец содержащий уникальный идентификатор ролика("B");
    - "NameRolickColumn" - столбец содержащий название ролика("C");
    - "DurationRolickColumn" - столбец содержащий хронометраж ролика"D";
    - "ValueNotInclude" - строка, признак отсутствия роликов("Нет размещений");
    - "PathFilesBXX" - путь к файлам BXX("./__tests__/__fixtures__").
```

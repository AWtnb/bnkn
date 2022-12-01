# bnkn

Text formatting tool for bibliographic information.

書誌情報の整形に使えそうな各種文字列操作ツールの詰め合わせ。

## メニュー表示：`bnkn.mainMenu`

+ 先頭の文字のみ大文字にして残りを小文字にする（`abc` → `Abc`）
+ dumb-quotes（間抜け引用符）を修正する（`"abc"` → `“abc”`）
+ Title Case（各単語の1文字目を大文字）にしたうえで `setting.json` の `titleCaseExceptions` で指定した単語はすべて小文字にする（`this is a pen` → `This is a Pen`）
+ イニシャル表記した欧米人名の配置を入れ替える（`Wtnb, A.` ↔ `A. Wtnb`）
+ 括弧類を二重にする（`「」‘’"` → `『』“”"`）
+ 括弧類を一重にする（`『』“”"` → `「」‘’"`）
+ 英数を全角にする（`123abc` → `１２３ａｂｃ`）
+ 英数を半角にする（`１２３ａｂｃ` → `123abc`）
+ 括弧類を全角にする（`()[]` → `（）［］`）
+ 括弧類を半角にする（`（）［］` → `()[]`）
+ 両端の括弧類を取り除く（`『桃太郎』` → `桃太郎`）

機能は随時追加予定。

## 対応する括弧内を選択する（デフォルト： <kbd>alt+shift+8</kbd> ）


対象としている括弧類：

+ `()`
+ `[]`
+ `{}`
+ `''`
+ `""`
+ `（）`
+ `［］`
+ `〔〕`
+ `《》`
+ `〈〉`
+ `「」`
+ `『』`
+ `【】`
+ `“”`
+ `‘’`

## 括弧で囲む

| command | 括弧 | デフォルトキー|
| :--- | :--- | :--- |
| `bnkn.wrapByCornarBracket` | `「」`| <kbd>ctrl+alt+w ctrl+[</kbd> |
| `bnkn.wrapByDoubleCornarBracket` | `「」`| <kbd>ctrl+alt+w ctrl+shift+[</kbd> |
| `bnkn.wrapByFullWidthBracket` | `［］`| <kbd>ctrl+alt+w ctrl+]</kbd> |
| `bnkn.wrapByFullWidthDoubleQuote` | `“”`| <kbd>ctrl+alt+w ctrl+2</kbd> |
| `bnkn.wrapByFullWidthParen` | `（）`| <kbd>ctrl+alt+w ctrl+8</kbd> |
| `bnkn.wrapByFullWidthSingleQuote` | `‘’`| <kbd>ctrl+alt+w ctrl+7</kbd> |
| `bnkn.wrapByTortoiseParen` | `〔〕`| <kbd>ctrl+alt+w ctrl+shift+8</kbd> |

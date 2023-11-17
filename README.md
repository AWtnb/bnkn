# bnkn

Text formatting tool for bibliographic information (mainly for Japanese user).

書誌情報の整形に使えそうな各種文字列操作ツールの詰め合わせ。

+ マルチカーソルに対応しています。
+ `setting.json` の `bnkn.skipUnselected` を `true` にすると、選択されている文字のみ置換します（選択状態にないと何もしません）。
    + この設定を `false` にすると、非選択状態のときはカーソルのある行全体に対して処理を行います。

## メニュー表示：`bnkn.mainMenu`（デフォルト： <kbd>ctrl+alt+b</kbd> ）

+ dumb-quotes（間抜け引用符）を修正する（`"abc"` → `“abc”`）
+ イニシャル表記した欧米人名の配置を入れ替える（`Wtnb, A.` ←→ `A. Wtnb`）
+ 刊行年の閉じパーレンの後ろにピリオドを追加／削除する（`(2020)` ←→ `(2020).`）
    + ピリオドの全角／半角はパーレンに応じて変更
+ ピリオド／カンマの全角半角を整える
    + 直前の文字が ASCII なら半角＆スペース
    + 直前の文字が ASCII でなければ全角ベタ
+ ハイフン／ダーシの整形
    + 数字の間にあるものはenダーシ（`–`）
    + アルファベットの間にあるものはハイフン（`‐`）
+ 括弧類を二重にする（`「」‘’'` → `『』“”"`）
+ 括弧類を一重にする（`『』“”"` → `「」‘’'`）
+ ネストされた括弧類を整理する
    + 一重鉤括弧の中は二重鉤括弧、その中はまた一重鉤括弧（`『『檸檬』を読む』` → `『「檸檬」を読む』`）
    + パーレンの中は亀甲パーレン、その中はまたパーレン（`（令和3年（2021年））` → `（令和3年〔2021年〕）`）
+ 英数を全角にする（`123abc` → `１２３ａｂｃ`）
+ 英数を半角にする（`１２３ａｂｃ` → `123abc`）
+ 括弧類を全角にする（`()[]` → `（）［］`）
+ 丸括弧を亀甲パーレンにする（`（）()` →  `〔〕`）
+ 括弧類の全角／半角を自動で変更する
    + 先頭がアルファベットから開始する場合は半角、そうでなければ全角
+ 両端の括弧類を取り除く（`『桃太郎』` → `桃太郎`）
+ Oxford-comma の切り替え（`a, b & c` ←→ `a, b, & c`）
+ 全角カンマと読点の切り替え（`，` ←→ `、`）

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
| `bnkn.wrapByBlackBrackets` | `【】`| <kbd>ctrl+alt+w ctrl+shift+]</kbd> |
| `bnkn.wrapByCircles` | `●●`| <kbd>ctrl+alt+w ctrl+0</kbd> |
| `bnkn.wrapByCornarBrackets` | `「」`| <kbd>ctrl+alt+w ctrl+[</kbd> |
| `bnkn.wrapByDoubleCornarBrackets` | `『』`| <kbd>ctrl+alt+w ctrl+shift+[</kbd> |
| `bnkn.wrapByFullWidthBrackets` | `［］`| <kbd>ctrl+alt+w ctrl+]</kbd> |
| `bnkn.wrapByFullWidthDoubleQuotes` | `“”`| <kbd>ctrl+alt+w ctrl+2</kbd> |
| `bnkn.wrapByFullWidthParens` | `（）`| <kbd>ctrl+alt+w ctrl+8</kbd> |
| `bnkn.wrapByFullWidthSingleQuotes` | `‘’`| <kbd>ctrl+alt+w ctrl+7</kbd> |
| `bnkn.wrapByFullWidthSquares` | `■■`| <kbd>ctrl+alt+w ctrl+4</kbd> |
| `bnkn.wrapByTortoiseBrackets` | `〔〕`| <kbd>ctrl+alt+w ctrl+shift+8</kbd> |
| `bnkn.wrapByTriangles` | `▲▲`| <kbd>ctrl+alt+w ctrl+shift+3</kbd> |

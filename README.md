

# FillerWordCounter

![gif](https://github.com/okuzaki1208/FillerWordCounter/blob/main/Sample_image/sample.gif)



## Overview
スピーチ時における「えっと」「まあ」「なんか」等、フィラーワードが出てしまう癖を正し、訓練することをを目的としたWebページです。  
設定したワードを検出すると、ビープ音と共にカウンターが加算されます。  
スピーチで使用することを想定し、ページ上部に簡易タイマーも設置しています。    

## Requirement
マイクのブラウザ上での使用権限    

動作確認済みブラウザ  
・Google chrome 126.0.6478.127  
・Microsoft Edge 126.0.2592.81    
※Firefox Browser 127.0.2 では動作しませんでした。    

## Usage
ローカルフォルダ上に展開し、上記ブラウザでFillerWordCounter.htmlを開いてください。  
又は、Webサーバー上に設置してご使用ください。    

チェックしたワードを検出すると、ビープ音と共にカウンターが加算されます。  
ページ最下部のボタンでカウンターをリセット可能です。  
ご自身で設定したいワードを入力することも可能です。    

ページ最上部のチェックでサウンドON/OFFを設定できます。  
タイマーが0になるとアラームが鳴ります。    

## Q & A


## Reference
[SpeechRecognition]: https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition

## Author
Kyohei Okuzaki @okuzaki1208

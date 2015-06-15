this.manifest = {
  "name": "設定とか",
  //"icon": "icon.png",
  "settings": [

    {
      "tab": "ウィジェット",
      "group": "動作",
      "name": "r18",
      "type": "checkbox",
      "label": "R18版千年戦争アイギスを起動する。",
      "text": "チェックを外すと一般版千年戦争アイギスを起動します。<br>「農作業する」ボタン右側の切り替えスイッチからも変更可能です。"
    },
    {
      "tab": "ウィジェット",
      "group": "動作",
      "name": "closeAlert",
      "type": "checkbox",
      "label": "閉じる前に警告する。",
      "text": "チェックを外すとアイギスウィジェットを閉じるとき、アラートが表示されなくなります。<br>設定は次回起動時から有効です。"
    },
    {
      "tab": "ウィジェット",
      "group": "表示",
      "name": "widgetResize",
      "type": "checkbox",
      "label": "ウィジェットの自動リサイズを有効にする。",
      "text": "ウィンドウのサイズを大きくしたあと、元の大きさにだいたい小さくすればピタッとリサイズします。"
    },

    {
      "tab": "通知",
      "group": "通知音",
      "name": "noticeSoundUpload",
      "type": "file",
      "label": "通知を出した時に再生する通知音ファイル",
      "text": "ファイルをアップロードする",
      "id": "noticeSoundUpload"
    },
    {
      "tab": "通知",
      "group": "通知音",
      "name": "noticeSoundFile",
      "type": "button-text",
      "label": "通知音",
      "id": "noticeSoundFile",
      "readonly": "true",
      "button": {
        "name": "noticeSoundFilePlay",
        "id": "noticeSoundFilePlay",
        "text": "視聴する"
      }
    },
    {
      "tab": "通知",
      "group": "通知音",
      "name": "noticeSoundVolume",
      "type": "slider",
      "label": "通知音量"
    },
    {
      "tab": "通知",
      "group": "スクリーンショットを保存した時に",
      "name": "noticeCaptureCompleted",
      "type": "checkbox",
      "label": "通知を出す。"
    },
    {
      "tab": "通知",
      "group": "スクリーンショットを保存した時に",
      "name": "noticeCaptureCompletedSound",
      "type": "checkbox",
      "label": "音を出す。"
    },
//    {
//      "tab": "通知",
//      "group": "ミッション・クエスト完了時に",
//      "name": "noticeMissionCompleted",
//      "type": "checkbox",
//      "label": "通知を出す。"
//    },
//    {
//      "tab": "通知",
//      "group": "ミッション・クエスト完了時に",
//      "name": "noticeMissionCompletedSound",
//      "type": "checkbox",
//      "label": "音を出す。"
//    },


    {
      "tab": "キャプチャ",
      "group": "ショートカットキー",
      "name": "shortcutKey",
      "type": "radioButtons",
      "label": "ショートカットキー",
      "options": [
        {
            "value": "0",
            "text": "Ctrl + Shift + 0"
        }
      ]
    },
    {
      "tab": "キャプチャ",
      "group": "保存形式",
      "name": "format",
      "type": "radioButtons",
      "label": "保存形式",
      "options": [
        {
            "value": "jpeg",
            "text": "jpeg形式で保存する。"
        },
        {
            "value": "png",
            "text": "png形式で保存する。"
        }
      ]
    },

    {
      "tab": "キャプチャ",
      "group": "保存ファイル名",
      "name": "fileNameformat",
      "type": "text",
      "label": "保存ファイルするファイル名を設定します。",
      "id": "fileNameformat"
    },
    {
      "tab": "キャプチャ",
      "group": "保存ファイル名",
      "type": "description",
      "text": "<lu><li>%Y=年(西暦4桁),%m=月(01～12),%d=日(01～31),%H=時(00～23),%M=分(00～59),%S=秒(00～59)</li></lu>"
    },

    {
      "tab": "Google Drive",
      "group": "Google Driveを利用する",
      "name": "googleDriveUse",
      "type": "checkbox",
      "label": "スクリーンショットをGoogle Drive上に保存する。",
      "id": "googleDriveUse"
    },

    {
      "tab": "Google Drive",
      "group": "Google Driveを利用する",
      "name": "googleDriveAuth",
      "type": "button-primary",
      "label": "Google Driveを利用する為に認証を行います。",
      "text": "認証",
      "id": "googleDriveAuth"
    },
    {
      "tab": "Google Drive",
      "group": "Google Driveを利用する",
      "type": "description",
      "text": "<lu><li>認証ボタンを押すとGoogleの認証画面がポップアップします。</li>\
        <li>承認ボタンを押したあと、白い画面になるので、☓でポップアップを消して、この画面を更新(F5)して下さい。</li></lu>"
    },

    {
      "tab": "Google Drive",
      "group": "保存先",
      "name": "googleDriveGet",
      "type": "button-primary",
      "label": "一覧ボタンを押して",
      "text": "一覧",
      "id": "googleDriveGet"
    },
    {
      "tab": "Google Drive",
      "group": "保存先",
      "name": "googleDriveList",
      "type": "listBox",
      "label": "下に表示されたディレクトリ一覧から保存先のディレクトリを選択してください。",
      "id": "googleDriveList",
      "options": [
      ]
    },
    {
      "tab": "Google Drive",
      "group": "保存先",
      "type": "description",
      "text": "<lu><li>ディレクトリ数によっては一覧が出るまで1分から2分ほどかかります。</li>\
        <li>選択しない場合はGoogle Driveの直下に保存します。</li></lu>"
    },
    {
      "tab": "Google Drive",
      "group": "保存先",
      "name": "googleDriveDirectory",
      "type": "text",
      "label": "選択した保存ディレクトリ名",
      "id": "googleDriveDirectory",
      "readonly": "true"
    },
    {
      "tab": "Google Drive",
      "group": "保存先",
      "name": "googleDriveDirectoryID",
      "type": "text",
      "label": "選択した保存ディレクトリID",
      "id": "googleDriveDirectoryID",
      "readonly": "true"
    },
    {
      "tab": "Google Drive",
      "group": "保存先",
      "name": "googleDriveClear",
      "type": "button-default",
      "text": "選択した保存ディレクトリをクリアする",
      "id": "googleDriveClear"
    },

    {
      "tab": "実験用",
      "group": "画面関連",
      "name": "zoom",
      "type": "checkbox",
      "label": "ズームを有効にする。"
    },

    {
      "tab": "実験用",
      "group": "デバッグ",
      "name": "debugLog",
      "type": "checkbox",
      "label": "デバッグログを出力する。"
    },
    {
      "tab": "実験用",
      "group": "デバッグ",
      "name": "debuglog1",
      "type": "a",
      "label": "#",
      "text": "デバッグファイル1"
    },
    {
      "tab": "実験用",
      "group": "デバッグ",
      "name": "debuglog2",
      "type": "a",
      "label": "#",
      "text": "デバッグファイル2"
    }
  ]
};

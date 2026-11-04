export const products = [
 {id:'api', number:'01', name:'LLM-JP API', en:'THE FOUNDATION', title:'日本語AIを、あなたのシステムへ。', description:'テキスト生成・複数プロンプトのバッチ処理を、既存の業務システムから。業務アプリをつなぐ共通の入口です。', tags:['テキスト生成','バッチ処理','認証付きAPI'], icon:'code', type:'API', color:'dark'},
 {id:'confidential', number:'02', name:'文書の社外秘判定', en:'DOCUMENT REVIEW', title:'公開する前に、もう一度確認。', description:'本文やPDFを入力し、分類と根拠を確認。担当者による情報公開の確認作業を支援します。', tags:['本文・PDF','根拠の確認','人による最終判断'], icon:'file', type:'WEB APP', color:'sage'},
 {id:'personality', number:'03', name:'性格特性の分析', en:'PERSONALITY INSIGHTS', title:'言葉と回答から、傾向を見つける。', description:'質問票・文章入力から特性の傾向を表示。保存した結果を履歴やトレンドで振り返れます。', tags:['質問票・文章','履歴・トレンド','結果の出力'], icon:'chart', type:'WEB APP', color:'sand'},
 {id:'blood', number:'04', name:'血液検査レビュー', en:'LAB DATA REVIEW', title:'検査データを、読みやすい一覧に。', description:'手入力・CSVの検査値を、入力された基準範囲と比較。表での確認と所見の下書きを補助します。', tags:['CSV・手入力','基準範囲との比較','確認用の一覧表'], icon:'lab', type:'WEB APP', color:'blue'},
 {id:'soap', number:'05', name:'SOAP Note Assistant', en:'CLINICAL NOTES', title:'会話を確認し、記録の下書きへ。', description:'音声の文字起こしを修正し、SOAP下書きへ。内容を医療者が確認して、選んだ帳票で出力します。', tags:['音声・文章','SOAP下書き','帳票・PDF印刷'], icon:'wave', type:'WEB APP', color:'peach'},
] as const;
export const productLabels: Record<string,string> = Object.fromEntries([...products.map(p=>[p.id,p.name]),['consultation','まず相談したい']]);
export const purposeLabels: Record<string,string> = {demo:'デモを見たい',trial:'試用を相談したい',integration:'API連携・導入を相談したい',consultation:'まず相談したい'};
export const deploymentLabels: Record<string,string> = {undecided:'相談して決めたい','on-premise':'社内・オンプレミス',cloud:'クラウド',hybrid:'両方を検討'};

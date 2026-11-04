import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={
 title:'KTL AI Products｜日本語AIを、業務で使えるかたちに',
 description:'LLM-JP APIと、文書レビュー・性格特性・検査データ・SOAP記録の業務アプリ。GitHubを活用した提供と、デモ・試用のご相談。',
 metadataBase:new URL('https://llm-jp.com'),
 icons:{icon:'/products/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>;}

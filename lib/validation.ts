export class InputError extends Error {}
export function parseApplication(value: unknown){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new InputError('入力内容を確認してください。');
 const d=value as Record<string,unknown>;
 const str=(key:string,max:number,required=false)=>{const v=d[key];if(typeof v!=='string'||v.trim().length>max||(required&&!v.trim()))throw new InputError('お名前・メールアドレスなどの入力内容を確認してください。');return v.trim();};
 const name=str('name',80,true),email=str('email',254,true),company=str('company',120),notes=str('notes',1200);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\r\n]/.test(email))throw new InputError('メールアドレスを確認してください。');
 const pick=(key:string,allowed:string[])=>{if(typeof d[key]!=='string'||!allowed.includes(d[key] as string))throw new InputError('製品・ご相談内容を選び直してください。');return d[key] as string;};
 const product=pick('product',['api','confidential','personality','blood','soap','consultation']);
 const purpose=pick('purpose',['demo','trial','integration','consultation']);
 const deployment=pick('deployment',['undecided','on-premise','cloud','hybrid']);
 const teamSize=pick('teamSize',['1-5','6-20','21+','undecided']);
 if(d.consent!==true)throw new InputError('申込情報の取り扱いへの同意が必要です。');
 const requestId=str('requestId',36,true);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId))throw new InputError('ページを再読み込みしてお試しください。');
 return {name,email,company,notes,product,purpose,deployment,teamSize,requestId};
}

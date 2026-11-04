const PR=['PN','Non PN','Layanan'],JB=['Pegawai','Barang','Modal'],SD=['RM','PNBP','PHLN'];
const rp=n=>Math.abs(n)>=1e9?(n/1e9).toLocaleString('id-ID',{maximumFractionDigits:2})+' M':(n/1e6).toLocaleString('id-ID',{maximumFractionDigits:1})+' jt';
const pc=(a,b)=>b>0?a/b*100:0,pf=v=>v.toLocaleString('id-ID',{maximumFractionDigits:1})+'%',cl=v=>v>=80?'hi':v>=60?'md':'lw';
const $=i=>document.getElementById(i),cfg=window.APP_CONFIG||{};
let tok=localStorage.getItem('sk_tok')||'',role='',M=null,S={},B={},pg=1,ed=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nt=(m,e)=>{const n=$('nt');n.textContent=m;n.style.background=e?'#d64545':'';n.style.display='block';setTimeout(()=>n.style.display='none',3500)};
async function api(action,data){
 if(!cfg.GAS_URL||/GANTI|XXXX/.test(cfg.GAS_URL))throw Error('Konfigurasi belum lengkap: isi GAS_URL di js/config.js');
 const r=await fetch(cfg.GAS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,token:tok,data:data||{}})}),j=await r.json();
 if(!j.success){if(j.code==='AUTH')keluar(true);throw Error(j.message)}return j.data}
function keluar(s){tok='';role='';localStorage.removeItem('sk_tok');localStorage.removeItem('sk_role');$('lg').hidden=false;if(s)$('msg').textContent='Sesi berakhir, silakan masuk lagi.'}
$('lf').onsubmit=async e=>{e.preventDefault();$('msg').textContent='';const b=e.submitter;b.disabled=true;
 try{const d=await api('login',{u:$('lu').value,p:$('lp').value});tok=d.token;localStorage.setItem('sk_tok',tok);localStorage.setItem('sk_role',d.role);$('lp').value='';await boot()}
 catch(x){$('msg').textContent=x.message}b.disabled=false};
$('bX').onclick=()=>keluar();
async function muat(){const d=await api('dash');M=d.M;S=d.S;B=d.B;init();draw()}
async function boot(){role=localStorage.getItem('sk_role')||'guest';try{await muat()}catch(x){$('msg').textContent=x.message;return}
 $('lg').hidden=true;$('rl').textContent='Peran: '+(role==='admin'?'Admin':'Tamu');document.querySelectorAll('.ao').forEach(e=>e.hidden=role!=='admin');tab('tD')}
function tab(t){['tD','tR','adm'].forEach(i=>$(i).hidden=i!==t);document.querySelectorAll('.tabs .btn').forEach(b=>b.classList.toggle('on',b.dataset.t===t));if(t==='tR')rows()}
document.querySelectorAll('.tabs .btn').forEach(b=>b.onclick=()=>tab(b.dataset.t));
['fS','fJ','fD','fP','fO'].forEach(i=>$(i).onchange=()=>draw());
function init(){const L=Object.entries(M.sat).sort((a,b)=>a[1].localeCompare(b[1])),o=L.map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join(''),v=$('fS').value;
 $('fS').innerHTML='<option value="">Semua satker ('+L.length+')</option>'+o;$('fS').value=v;$('rS').innerHTML='<option value="">Semua satker</option>'+o;$('eS').innerHTML=o;
 $('bk').innerHTML=L.map(([k,v])=>`<label>${esc(v)}<input type="number" min="0" data-k="${k}" value="${B[k]||''}"></label>`).join('')}
function sel(){const s=$('fS').value,j=$('fJ').value,d=$('fD').value,p=$('fP').value,o=[];
 for(const k in S){if(s&&k!==s)continue;for(const r of S[k]){if(j!==''&&r[1]!=j||d!==''&&r[2]!=d||p!==''&&M.ro[r[0]][2]!=p)continue;o.push([k,...r])}}
 return{o,line:j!==''||d!==''||p!=='',s}}
function draw(){if(!M)return;const{o,line,s}=sel();let pg=0,rl=0;const bs={},pj={},pd={};
 const T=(m,k,r)=>{(m[k]=m[k]||[0,0]);m[k][0]+=r[4];m[k][1]+=r[5]};
 for(const r of o){pg+=r[4];rl+=r[5];T(bs,r[0],r);T(pj,r[2],r);T(pd,r[3],r)}
 for(const k in S)if(!bs[k]&&(!s||k===s))bs[k]=[0,0];
 const bl=line?0:Object.keys(bs).reduce((a,k)=>a+(+B[k]||0),0),ef=pg-bl,sp=ef-rl,cp=pc(rl,ef);
 $('kp').innerHTML=[['Total pagu',pg],['Blokir',bl],['Pagu efektif',ef],['Total realisasi',rl],['Sisa pagu',sp]].map(([t,v])=>`<div class="card k"><span>${t}</span><b title="Rp ${v.toLocaleString('id-ID')}">Rp ${rp(v)}</b></div>`).join('')+`<div class="card k"><span>Capaian serapan</span><b class="${cl(cp)}">${pf(cp)}</b></div>`;
 const L=Object.entries(bs).filter(([k,v])=>v[0]>0).map(([k,v])=>({n:M.sat[k],a:v[0],r:v[1],p:pc(v[1],v[0])})),key=$('fO').value==='p'?'p':'r';
 L.sort((a,b)=>b[key]-a[key]);const mx=Math.max(...L.map(x=>x[key]),1);
 const rk=(a,c)=>a.map(x=>`<div class="rk ${c}"><span>${x.n}</span><b>${key==='p'?pf(x.p):'Rp '+rp(x.r)}</b><small>Rp ${rp(x.r)} dari Rp ${rp(x.a)}</small><small style="text-align:right">${key==='p'?'':pf(x.p)}</small><i><u style="width:${x[key]/mx*100}%"></u></i></div>`).join('')||'<span class="mu">Tidak ada data.</span>';
 $('top').innerHTML=rk(L.slice(0,5),'');$('low').innerHTML=rk(L.slice(-5).reverse(),'lo');
 dn('c1',PR,pickM(o));dn('c2',JB,pj);dn('c3',SD,pd);tree(o);
 $('ft').textContent=`Sumber: ${M.file||'-'} (diunduh ${M.unduh||'-'}). Sisa pagu = pagu efektif − realisasi. Blokir hanya berlaku di tingkat satker, sehingga bernilai 0 saat filter jenis belanja, sumber dana, atau prioritas aktif.`}
function pickM(o){const m={};for(const r of o){const p=M.ro[r[1]][2];(m[p]=m[p]||[0,0]);m[p][0]+=r[4];m[p][1]+=r[5]}return m}
function dn(id,lb,m){const cv=$(id),d=lb.map((_,i)=>(m[i]||[0,0])[1]),tp=lb.map((_,i)=>(m[i]||[0,0])[0]);
 if(ch[id])ch[id].destroy();const cs=getComputedStyle(document.body);
 ch[id]=new Chart(cv,{type:'doughnut',data:{labels:lb,datasets:[{data:d,backgroundColor:['#1e4fa3','#2f80ed','#8fbaf5'],borderWidth:0}]},options:{cutout:'62%',plugins:{legend:{position:'bottom',labels:{color:cs.color}},tooltip:{callbacks:{label:c=>`${c.label}: Rp ${rp(c.raw)} (serapan ${pf(pc(c.raw,tp[c.dataIndex]))})`}}}}})}
function tree(o){const t={};
 for(const r of o){const kw=r[0]==='431705',ro=M.ro[r[1]],sk=(kw?ro[4]:ro[3])||'Lainnya',a=(t[r[0]]=t[r[0]]||{v:[0,0],c:{}}),b=(a.c[sk]=a.c[sk]||{v:[0,0],c:{}}),c=(b.c[ro[1]]=b.c[ro[1]]||{v:[0,0]});
  for(const x of[a,b,c]){x.v[0]+=r[4];x.v[1]+=r[5]}}
 const rw=(n,v,cls)=>{const q=pc(v[1],v[0]);return`<div class="row ${cls||''}"><span class="n">${n}</span><span>${rp(v[0])}</span><span>${rp(v[1])}</span><span>${rp(v[0]-v[1])}</span><span class="p ${cl(q)}">${pf(q)}</span></div>`},sm=(n,v,c,k)=>`<details class="${k}"><summary>${rw(n,v)}</summary>${c}</details>`;
 const so=m=>Object.entries(m).sort((a,b)=>b[1].v[1]-a[1].v[1]);
 $('tr').innerHTML=`<div class="row hd"><span>Satker / seksi / uraian RO</span><span>Pagu</span><span>Realisasi</span><span>Sisa</span><span>%</span></div>`+so(t).map(([k,a])=>sm(M.sat[k],a.v,so(a.c).map(([s,b])=>sm(s,b.v,so(b.c).map(([n,c])=>rw(n,c.v,'l3')).join(''),'l2')).join(''),'l1')).join('')}

// ---------- Unduh Excel & PDF ----------
$('bE').onclick=()=>{const{o}=sel(),sat={},tr={};
 for(const r of o){const a=(sat[r[0]]=sat[r[0]]||[0,0]);a[0]+=r[4];a[1]+=r[5];const ro=M.ro[r[1]],sk=(r[0]==='431705'?ro[4]:ro[3])||'Lainnya',k=[r[0],sk,ro[1]].join('|'),t=(tr[k]=tr[k]||[0,0]);t[0]+=r[4];t[1]+=r[5]}
 const one=$('fJ').value||$('fD').value||$('fP').value,A=[['Satker','Pagu','Blokir','Pagu efektif','Realisasi','Sisa pagu','Capaian (%)']];
 for(const k in sat){const b=one?0:(+B[k]||0),e=sat[k][0]-b;A.push([M.sat[k],sat[k][0],b,e,sat[k][1],e-sat[k][1],+pc(sat[k][1],e).toFixed(2)])}
 const R=[['Satker','Seksi','Uraian RO','Pagu','Realisasi','Sisa pagu','Capaian (%)']];
 Object.keys(tr).sort().forEach(k=>{const q=k.split('|'),v=tr[k];R.push([M.sat[q[0]],q[1],q[2],v[0],v[1],v[0]-v[1],+pc(v[1],v[0]).toFixed(2)])});
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(A),'Ringkasan');XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(R),'Rincian RO');
 XLSX.writeFile(wb,'Realisasi_Keuangan_Sulsel.xlsx')};
$('bP').onclick=()=>{document.querySelectorAll('#tr details').forEach(d=>d.open=true);window.print()};
// ---------- Data baris (admin) ----------
async function rows(){try{const d=await api('rows',{satker:$('rS').value,q:$('rQ').value,page:pg}),n=Math.max(1,Math.ceil(d.total/50));
 $('rT').innerHTML=d.rows.map(r=>`<tr><td>${esc(M.sat[r[1]]||r[1])}</td><td>${r[2]}</td><td title="${esc(r[8])}">${r[3]}</td><td>${r[4]}</td><td class="n">${r[6].toLocaleString('id-ID')}</td><td class="n">${r[7].toLocaleString('id-ID')}</td><td><button class="btn g" data-r='${esc(JSON.stringify(r))}'>Ubah</button></td></tr>`).join('')||'<tr><td colspan="7">Tidak ada baris.</td></tr>';
 $('rI').textContent=`${d.total.toLocaleString('id-ID')} baris · halaman ${pg} dari ${n}`;$('rPv').disabled=pg<=1;$('rNx').disabled=pg>=n;
 $('rT').querySelectorAll('button').forEach(b=>b.onclick=()=>edit(JSON.parse(b.dataset.r)))}catch(x){nt(x.message,1)}}
$('rS').onchange=$('rQ').onchange=()=>{pg=1;rows()};$('rPv').onclick=()=>{pg--;rows()};$('rNx').onclick=()=>{pg++;rows()};
function edit(r){ed=r;$('eT').textContent=r?'Ubah baris #'+r[0]:'Tambah baris';$('eDel').hidden=!r;
 const v=r||['',$('rS').value||Object.keys(M.sat)[0],'','','A','',0,0];$('eS').value=v[1];$('eA').value=v[2];$('eR').value=v[3];$('eD').value=v[4];$('eP').value=v[6];$('eL').value=v[7];$('dg').showModal()}
$('bN').onclick=()=>edit(null);$('eC').onclick=()=>$('dg').close();
$('ef').onsubmit=async e=>{e.preventDefault();try{await api('rowSave',{id:ed?ed[0]:'',satker:$('eS').value,akun:$('eA').value.trim(),kdro:$('eR').value.trim(),sd:$('eD').value.trim().toUpperCase(),coa:ed?undefined:'',pagu:$('eP').value,real:$('eL').value});
 $('dg').close();nt('Baris tersimpan.');await rows();await muat()}catch(x){nt(x.message,1)}};
$('eDel').onclick=async()=>{if(!confirm('Hapus baris #'+ed[0]+'? Tindakan ini tidak bisa dibatalkan.'))return;
 try{await api('rowDel',{id:ed[0]});$('dg').close();nt('Baris dihapus.');await rows();await muat()}catch(x){nt(x.message,1)}};
// ---------- Panel admin ----------
$('sb').onclick=async()=>{const v={};document.querySelectorAll('#bk input').forEach(i=>{if(i.value)v[i.dataset.k]=+i.value});
 try{await api('blokirSave',{v});nt('Blokir tersimpan.');await muat()}catch(x){nt(x.message,1)}};
$('sp').onclick=async()=>{try{await api('ubahSandi',{lama:$('pl').value,baru:$('pb').value});$('pl').value=$('pb').value='';nt('Kata sandi diubah.')}catch(x){nt(x.message,1)}};
const nm=s=>typeof s==='number'?s:parseInt(String(s).replace(/\./g,''),10)||0;
$('fm').onchange=async e=>{const f=e.target.files[0];if(!f)return;const u=$('ms');u.textContent='Membaca…';
 try{const wb=XLSX.read(await f.arrayBuffer()),J=n=>{if(!wb.Sheets[n])throw Error('sheet '+n+' tidak ada');return XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true}).slice(1).filter(r=>r[0]!=null)},un={};
  J('kd_unit').forEach(r=>un[String(r[0]).trim()]=[r[2],r[3]]);
  const sat=J('db_satker').map(r=>[r[0],r[1]]),ro=J('kd_RO').map(r=>{const k=String(r[0]).trim(),x=un[k]||[];return[k,String(r[1]).trim(),String(r[2]).trim(),x[0]||'',x[1]||'']});
  await api('impMaster',{sat,ro});u.textContent=`Master diperbarui: ${sat.length} satker, ${ro.length} RO.`;await muat()}catch(x){u.textContent='Gagal: '+x.message}e.target.value=''};
$('fu').onchange=async e=>{const f=e.target.files[0];if(!f)return;const u=$('us');u.textContent='Membaca berkas…';
 try{const wb=XLSX.read(await f.arrayBuffer()),a=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames.includes('Data')?'Data':wb.SheetNames[0]],{header:1,raw:true}),hi=a.findIndex(r=>r&&r.includes('KODE COA'));
  if(hi<0)throw Error('kolom KODE COA tidak ditemukan; gunakan format Realisasi FA berdasarkan SP2D');
  const h=a[hi],ix=n=>h.indexOf(n),tm=(String(a[1]&&a[1][0]||'').match(/\d\d-\d\d-\d{4} \d\d:\d\d/)||[''])[0],R=[];
  for(const r of a.slice(hi+1)){const c=r[ix('KODE COA')];if(!c)continue;const p=String(c).split('.');R.push([p[0],String(r[ix('KODE AKUN')]),p[4].slice(0,4)+'.'+p[4].slice(4)+'.'+p[12],String(r[ix('KODE SUMBER DANA')])[0],String(c),nm(r[ix('PAGU')]),nm(r[ix('REALISASI')])])}
  for(let i=0;i<R.length;i+=1500){u.textContent=`Mengirim ${Math.min(i+1500,R.length).toLocaleString('id-ID')} dari ${R.length.toLocaleString('id-ID')} baris…`;await api('impChunk',{reset:i===0,rows:R.slice(i,i+1500)})}
  await api('impDone',{file:f.name,unduh:tm?tm+' WITA':''});u.textContent=`Selesai: ${R.length.toLocaleString('id-ID')} baris diimpor.`;await muat()}catch(x){u.textContent='Gagal: '+x.message}e.target.value=''};
if(tok)boot();

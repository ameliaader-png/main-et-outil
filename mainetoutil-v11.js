const artisans=[{slug:'atelier-du-vitrail',name:'Atelier du Vitrail',person:'Hélène Espié',metier:'Maître verrier',ville:'Nantes',departement:'Loire-Atlantique',region:'Pays de la Loire',cls:'vitrail',image:'assets/artisans/helene-05.jpg',gallery:['assets/artisans/helene-02.jpg','assets/artisans/helene-03.jpg','assets/artisans/helene-06.jpg','assets/artisans/helene-07.jpg'],excerpt:'Plus de 25 ans à travailler le verre, la couleur et la lumière, entre patrimoine et création contemporaine.',address:'Nantes, Loire-Atlantique (44)',phone:'06 82 31 60 66',email:'',site:'https://vitrail-espie.fr',instagram:'',youtube:'https://youtube.com/@mainetoutil'},{slug:'atelier-maroline',name:'Atelier Maroline',person:'Marion Girault',metier:'Maroquinière',ville:'Montjean-sur-Loire',departement:'Maine-et-Loire',region:'Pays de la Loire',cls:'maroline',image:'assets/artisans/marion-03.jpg',gallery:['assets/artisans/marion-04.jpg','assets/artisans/marion-06.jpg','assets/artisans/marion-07.jpg','assets/artisans/marion-09.jpg','assets/artisans/marion-13.jpg'],excerpt:'Des créations inspirées par la matière, les usages et les surplus de cuir issus de l’industrie de la mode.',address:'36 rue d’Anjou, 49570 Montjean-sur-Loire',phone:'06 44 04 04 16',email:'info@atelier-maroline.com',site:'https://atelier-maroline.com',instagram:'https://instagram.com/atelier.maroline',youtube:'https://youtube.com/@mainetoutil'}];
const logo='<span>MAIN <i>— & —</i> OUTIL</span><small>MÉDIA DES ARTISANS D’ART</small>';
document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="photo-overrides.css?v=6">');
function header(){return `<header><nav class="wrap"><a class="brand" href="index.html">${logo}</a><button class="menu" aria-expanded="false">Menu</button><div class="links" id="nav-links"><a href="index.html">Accueil</a><a href="index.html#concept">Le concept</a><a href="index.html#tour">Le Tour</a><a href="annuaire.html">Annuaire</a><a href="contact.html">Contact</a><a class="btn gold" href="candidater.html">Candidater</a></div></nav></header>`}function footer(){return `<footer><div class="wrap footer-grid"><div><div class="brand">${logo}</div><p>Un média indépendant dédié à la valorisation des savoir-faire artisanaux français.</p><div class="socials"><a href="https://instagram.com/mainetoutil">Instagram</a><a href="https://tiktok.com/@mainetoutil">TikTok</a><a href="https://youtube.com/@mainetoutil">YouTube</a></div></div><div><h4>Navigation</h4><a href="index.html">Accueil</a><a href="annuaire.html">Annuaire</a><a href="candidater.html">Candidater</a></div><div><h4>Informations</h4><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a><a href="contact.html">Contact</a></div><div><h4>Contact</h4><a href="mailto:contact@mainetoutil.com">contact@mainetoutil.com</a><p>Sur les routes de France, à la rencontre des gestes qui durent.</p></div></div><div class="wrap footer-bottom">© ${new Date().getFullYear()} Main & Outil · Tous droits réservés</div></footer>`}document.querySelectorAll('[data-header]').forEach(x=>x.innerHTML=header());document.querySelectorAll('[data-footer]').forEach(x=>x.innerHTML=footer());document.querySelector('.menu')?.addEventListener('click',e=>{let o=e.currentTarget.getAttribute('aria-expanded')==='true';e.currentTarget.setAttribute('aria-expanded',String(!o));document.querySelector('#nav-links').classList.toggle('open',!o)});
function card(a){return `<a class="portrait-card ${a.cls}" style="background-image:url('${a.image}')" href="artisan.html?id=${a.slug}"><div><span class="eyebrow">${a.metier}</span><h3>${a.name}</h3><p>${a.person} · ${a.ville}</p><span class="card-link">Découvrir le portrait →</span></div></a>`}function fillSelect(id,key){let e=document.querySelector('#'+id);if(!e)return;[...new Set(artisans.map(a=>a[key]).filter(Boolean))].sort().forEach(v=>e.insertAdjacentHTML('beforeend',`<option>${v}</option>`))}function renderDirectory(){let g=document.querySelector('#directory');if(!g)return;let q=(document.querySelector('#search').value||'').toLowerCase();let keys=['metier','region','departement','ville'],vals=keys.map(k=>document.querySelector('#'+k).value);let list=artisans.filter(a=>(Object.values(a).join(' ')).toLowerCase().includes(q)&&vals.every((v,i)=>!v||a[keys[i]]===v));g.innerHTML=list.length?list.map(card).join(''):'<div class="empty">Aucun artisan ne correspond à ces critères.</div>';document.querySelector('[data-count]').textContent=`${list.length} artisan${list.length>1?'s':''}`};['metier','region','departement','ville'].forEach(id=>fillSelect(id,id));document.querySelectorAll('.filters input,.filters select').forEach(x=>x.addEventListener('input',renderDirectory));renderDirectory();
function initGallery(){const track=document.querySelector('.gallery-track');if(!track)return;document.querySelector('.gallery-prev')?.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.82,behavior:'smooth'}));document.querySelector('.gallery-next')?.addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.82,behavior:'smooth'}))}
function saveSubmission(form,type){let d=Object.fromEntries(new FormData(form).entries());d.type=type;d.date=new Date().toISOString();let all=JSON.parse(localStorage.getItem('mainetoutil-submissions')||'[]');all.unshift(d);localStorage.setItem('mainetoutil-submissions',JSON.stringify(all));return d}
function renderAdmin(){let root=document.querySelector('#admin-list');if(!root)return;let all=JSON.parse(localStorage.getItem('mainetoutil-submissions')||'[]');root.innerHTML=all.length?all.map((x,i)=>`<article class="admin-card"><span class="eyebrow">${x.type} · ${new Date(x.date).toLocaleString('fr-FR')}</span><h3>${x.nom}</h3><p>${x.email||''}</p><details><summary>Voir les informations</summary>${Object.entries(x).map(([k,v])=>`<p><strong>${k}</strong><br>${String(v).replaceAll('<','&lt;')}</p>`).join('')}</details><button class="btn remove" data-i="${i}">Supprimer</button></article>`).join(''):'<div class="empty">Aucune demande enregistrée sur cet appareil.</div>';root.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{all.splice(+b.dataset.i,1);localStorage.setItem('mainetoutil-submissions',JSON.stringify(all));renderAdmin()})}renderAdmin();

// Envoi direct des formulaires depuis le site, sans ouvrir la messagerie du visiteur.
document.querySelectorAll('form[data-form]').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  if(!form.reportValidity())return;
  const button=form.querySelector('button[type="submit"]');
  const message=form.querySelector('[data-message]');
  const initialLabel=button.textContent;
  const data=Object.fromEntries(new FormData(form).entries());
  data._subject=`${form.dataset.form==='candidature'?'Nouvelle candidature':'Nouveau message'} Main & Outil — ${data.nom}`;
  data._template='table';
  data.formulaire=form.dataset.form;
  button.disabled=true;
  button.textContent='Envoi en cours…';
  message.classList.remove('error');
  message.textContent='';
  try{
    const response=await fetch('https://formsubmit.co/ajax/contact@mainetoutil.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok||result.success===false)throw new Error('Envoi refusé');
    saveSubmission(form,form.dataset.form);
    form.reset();
    message.textContent=form.dataset.form==='candidature'?'Votre candidature a bien été envoyée. Merci pour votre confiance.':'Votre message a bien été envoyé. Nous vous répondrons prochainement.';
  }catch(error){
    message.classList.add('error');
    message.textContent='L’envoi n’a pas abouti. Réessayez dans quelques instants ou écrivez à contact@mainetoutil.com.';
  }finally{
    button.disabled=false;
    button.textContent=initialLabel;
  }
},true));

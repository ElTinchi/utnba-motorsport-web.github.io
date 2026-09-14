import {cleanUnderbody} from './undertray.js?v=side-rail-20';
import {reserved} from './zones.js?v=no-sae-20';
import {CarRenderer,parseGLB,cameraBasis,rayDirection,raycast,norm,cross,dot,scale,add,decodeImage} from './engine.js?v=mobile-memory-21';
const $=id=>document.getElementById(id),canvas=$('car-canvas');
const camera={yaw:.72,pitch:.23,distance:9.5};
const presets={three:[.72,.23],side:[Math.PI/2,.1],other:[-Math.PI/2,.1],front:[0,.09],rear:[Math.PI,.12],top:[0,Math.PI/2-.001]};
let renderer=null,model=null,ready=false,auto=false,dirty=true,placing=false,placement=null,logoAspect=1,hasLogo=false,logoURL=null,uploadSerial=0;
let active=true,previous=0,frame=0,loadController=null;
const pointers=new Map();let gesture=null;
const mark=()=>{dirty=true;};
function message(text){$('placement-status').textContent=text;}
function setPlacing(value){placing=value;canvas.classList.toggle('placing',value);$('place-logo').setAttribute('aria-pressed',String(value));$('place-logo').textContent=value?'Tocá la carrocería':'Elegir ubicación';}
function updateSteps(){
 const uploaded=hasLogo,positioned=uploaded&&Boolean(placement);
 $('step-upload').classList.toggle('customizer-step--active',!uploaded);
 $('step-upload').classList.toggle('customizer-step--complete',uploaded);
 $('step-place').classList.toggle('customizer-step--active',uploaded&&!positioned);
 $('step-place').classList.toggle('customizer-step--complete',positioned);
 $('step-adjust').classList.toggle('customizer-step--active',positioned);
 $('download-image').disabled=!ready||!positioned;
}
function stopRotation(){auto=false;$('rotate').setAttribute('aria-pressed','false');}
function fitDistance(){return 8.3/Math.min(1,canvas.clientWidth/Math.max(canvas.clientHeight,1));}
function chooseView(name){[camera.yaw,camera.pitch]=presets[name];camera.distance=fitDistance();stopRotation();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));mark();}
function clearPreset(){document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}
function zoom(factor){camera.distance=Math.min(23,Math.max(3.8,camera.distance*factor));mark();}
function decal(){
  if(!hasLogo||!placement||!$('show-logo').checked)return null;
  const angle=Number($('logo-angle').value)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  const width=(placement.mirror ? .45 : .75)*Number($('logo-size').value)/100;
  return {...placement,right:add(scale(placement.right,c),scale(placement.up,s)),up:add(scale(placement.up,c),scale(placement.right,-s)),width,height:width/logoAspect};
}
async function reservations(){
 const response=await fetch('assets/sae-monochrome.png');
 if(!response.ok)throw Error('No se pudo cargar el logo SAE. Volvé a intentar.');
 const markSource=await decodeImage(await response.blob());
 const markCanvas=document.createElement('canvas');markCanvas.width=720;markCanvas.height=472;
 markCanvas.getContext('2d').drawImage(markSource,180,174,720,472,0,0,720,472);markSource.close();
 const utnResponse=await fetch('assets/utn-ba-white.png');
 if(!utnResponse.ok)throw Error('No se pudo cargar el logo UTN. Volvé a intentar.');
 const utnSource=await decodeImage(await utnResponse.blob());
 const utnMark=document.createElement('canvas');utnMark.width=2880;utnMark.height=788;
 utnMark.getContext('2d').drawImage(utnSource,95,51,2880,788,0,0,2880,788);utnSource.close();
 const mobile=matchMedia('(pointer: coarse)').matches||innerWidth<800;
 const atlasSize=mobile?2048:4096,badgeSize=mobile?512:1024;
 const texture=document.createElement('canvas');texture.width=texture.height=atlasSize;
 const ctx=texture.getContext('2d');
 for(const zone of reserved){
  const [u,v,w,h]=zone.box,x=u*atlasSize,y=v*atlasSize,width=w*atlasSize,height=h*atlasSize;
  if(zone.kind==='number'||zone.kind==='utn')continue;
  const fit=Math.min(width/markCanvas.width,height/markCanvas.height);
  const dw=markCanvas.width*fit,dh=markCanvas.height*fit;
  ctx.save();ctx.translate(x+width/2,y+height/2);
  if(zone.flipX)ctx.scale(-1,1);
  ctx.drawImage(markCanvas,-dw/2,-dh/2,dw,dh);ctx.restore();
 }
 renderer.setReservations(texture);
 renderer.setInstitution(utnMark,reserved.filter(z=>z.kind==='utn').map(z=>z.box));
 markCanvas.width=markCanvas.height=0;utnMark.width=utnMark.height=0;texture.width=texture.height=0;
 // Separate badge texture; mobile uses half resolution to avoid exhausting GPU memory.
 const badge=document.createElement('canvas');badge.width=badge.height=badgeSize;
 const badgeCtx=badge.getContext('2d'),diameter=badgeSize*.92,center=badgeSize/2;
 badgeCtx.fillStyle='#ffffff';badgeCtx.beginPath();badgeCtx.arc(center,center,diameter/2,0,Math.PI*2);badgeCtx.fill();
 // Draw the border inside the approved circle footprint, without enlarging it.
 const borderWidth=diameter*.035;
 badgeCtx.strokeStyle='#000000';badgeCtx.lineWidth=borderWidth;
 badgeCtx.beginPath();badgeCtx.arc(center,center,(diameter-borderWidth)/2,0,Math.PI*2);badgeCtx.stroke();
 badgeCtx.fillStyle='#000000';badgeCtx.textAlign='center';badgeCtx.textBaseline='middle';
 badgeCtx.font=`${Math.floor(diameter*.78)}px Arial`;
 badgeCtx.fillText('7',center,center+diameter*.04,diameter*.65);
 const boxes=reserved.filter(z=>z.kind==='number').map(z=>{
  if(z.uvAspectCorrection)return z.box;
  const [x,y,w,h]=z.box,side=Math.min(w,h);
  return [x+(w-side)/2,y+(h-side)/2,side,side];
 });
 renderer.setNumbers(badge,boxes);
 badge.width=badge.height=0;
}
function placeAt(x,y){
 const rect=canvas.getBoundingClientRect(),basis=cameraBasis(camera.yaw,camera.pitch,camera.distance);
 const dir=rayDirection(basis,(x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2,rect.width/rect.height);
 let hit=raycast(model.meshes,basis.eye,dir);
 const centered=hit?.body&&hit.normal[1]>.55&&Math.abs(hit.normal[0])<.65;
 if(centered){
  const body=model.meshes.filter(m=>m.body),height=Math.max(...body.map(m=>m.max[1]))+1;
  const centerHit=raycast(body,[0,height,hit.point[2]],[0,-1,0]);
  if(!centerHit){message('No hay una superficie central en esa posición. Elegí otra zona.');return;}
  hit={...centerHit,point:[0,centerHit.point[1],centerHit.point[2]],normal:norm([0,centerHit.normal[1],centerHit.normal[2]])};
 }
 if(!hit||!hit.body){message('Elegí una superficie de la carrocería.');return;}
 if(hit.uv&&reserved.some(z=>hit.uv[0]>=z.box[0]&&hit.uv[0]<=z.box[0]+z.box[2]&&hit.uv[1]>=z.box[1]&&hit.uv[1]<=z.box[1]+z.box[3])){message('Ese espacio está reservado para la identidad reglamentaria o el número del auto.');return;}
 let right=centered?[1,0,0]:norm(cross([0,1,0],hit.normal));
 if(!centered&&Math.abs(dot(hit.normal,[0,1,0]))>.92)right=norm(cross([0,0,-1],hit.normal));
 placement={point:hit.point,normal:hit.normal,right,up:norm(cross(hit.normal,right)),mirror:!centered};
 $('logo-adjustments').disabled=false;$('show-logo').checked=true;$('logo-angle').value=0;$('angle-value').textContent='0°';setPlacing(false);updateSteps();message(centered?'Logo centrado sobre el eje del auto.':'Logo aplicado simétricamente en ambos laterales.');mark();
}
$('place-logo').addEventListener('click',()=>{stopRotation();setPlacing(!placing);message(placing?'Tocá la carrocería para colocar tu logo.':'Podés girar el auto.');});
function tick(now){
  if(ready&&active&&!document.hidden){
    if(auto){camera.yaw+=Math.min((now-previous)/1000,.05)*.18;dirty=true;}
    if(dirty){renderer.render(camera,decal());dirty=false;}
  }
  previous=now;frame=requestAnimationFrame(tick);
}
frame=requestAnimationFrame(tick);
new ResizeObserver(mark).observe(canvas);
new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)mark();}).observe(canvas);
document.addEventListener('visibilitychange',mark);
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;showError('Se interrumpió la aceleración gráfica. Volvé a cargar el visor.');});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
function showError(text){$('loading').hidden=false;$('loading').classList.add('failed');$('loading').querySelector('strong').textContent='NO PUDIMOS ABRIR EL AUTO';$('load-progress').textContent=text;$('retry').hidden=false;}
$('retry').addEventListener('click',()=>location.reload());
async function load(){
  try{
    loadController=new AbortController();
    const response=await fetch('assets/model/auto.glb',{signal:loadController.signal});if(!response.ok)throw Error('No se pudo descargar el modelo. Volvé a intentar.');
    let buffer;
    if(response.body){
      const reader=response.body.getReader(),total=Number(response.headers.get('content-length')),parts=[];let count=0;
      while(true){const {done,value}=await reader.read();if(done)break;parts.push(value);count+=value.byteLength;$('load-progress').textContent=total?`Cargando el modelo · ${Math.round(count/total*100)}%`:`Cargando el modelo · ${(count/1e6).toFixed(1)} MB`;}
      const bytes=new Uint8Array(count);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}buffer=bytes.buffer;
    }else buffer=await response.arrayBuffer();
    $('load-progress').textContent='Preparando geometría y materiales…';await new Promise(resolve=>setTimeout(resolve,40));
    model=parseGLB(buffer);cleanUnderbody(model,raycast);renderer=new CarRenderer(canvas,model);await renderer.initTextures();
    // Release compressed image storage once textures are on the GPU.
    model.imageBlobs=[];await reservations();ready=true;chooseView('three');renderer.render(camera,null);
    $('loading').hidden=true;$('logo-file').disabled=false;
    document.querySelectorAll('.stage button').forEach(b=>b.disabled=false);updateSteps();
    mark();
  }catch(error){if(error.name!=='AbortError'){console.error(error);showError(error.message||'Ocurrió un problema al cargar el auto.');}}
}
load();
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>chooseView(button.dataset.view)));
$('zoom-in').addEventListener('click',()=>zoom(.88));$('zoom-out').addEventListener('click',()=>zoom(1.14));$('reset-view').addEventListener('click',()=>chooseView('three'));
$('rotate').addEventListener('click',()=>{auto=!auto;if(auto){setPlacing(false);clearPreset();}$('rotate').setAttribute('aria-pressed',String(auto));mark();});
canvas.addEventListener('wheel',event=>{if(!ready)return;event.preventDefault();zoom(Math.exp(Math.max(-100,Math.min(100,event.deltaY))*.0015));},{passive:false});
canvas.addEventListener('keydown',event=>{
  if(!ready)return;
  const actions={ArrowLeft:()=>camera.yaw-=.12,ArrowRight:()=>camera.yaw+=.12,ArrowUp:()=>camera.pitch=Math.min(1.569,camera.pitch+.1),ArrowDown:()=>camera.pitch=Math.max(-.25,camera.pitch-.1),'+':()=>zoom(.9),'=':()=>zoom(.9),'-':()=>zoom(1.1),'Escape':()=>setPlacing(false)};
  if(actions[event.key]){event.preventDefault();stopRotation();actions[event.key]();clearPreset();mark();}
});
canvas.addEventListener('pointerdown',event=>{
  if(!ready)return;canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,[event.clientX,event.clientY]);stopRotation();
  if(pointers.size===1)gesture={x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false,multi:false};
  if(pointers.size===2){gesture.multi=true;const [a,b]=[...pointers.values()];gesture.pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}
});
canvas.addEventListener('pointermove',event=>{
  if(!pointers.has(event.pointerId)||!gesture)return;
  pointers.set(event.pointerId,[event.clientX,event.clientY]);
  if(pointers.size===2){const [a,b]=[...pointers.values()],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(gesture.pinch>0&&distance>0)zoom(gesture.pinch/distance);gesture.pinch=distance;return;}
  if(gesture.multi)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY)>5)gesture.moved=true;
  if(gesture.moved){camera.yaw-=dx*.007;camera.pitch=Math.max(-.25,Math.min(1.569,camera.pitch+dy*.007));clearPreset();mark();}
  gesture.x=event.clientX;gesture.y=event.clientY;
});
function endPointer(event){
  if(!pointers.has(event.pointerId))return;

  const canPlace=event.type==='pointerup'&&gesture&&!gesture.moved&&!gesture.multi&&placing&&hasLogo;
  pointers.delete(event.pointerId);if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  if(!pointers.size)gesture=null;
  if(canPlace)placeAt(event.clientX,event.clientY);

}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
for(const id of ['logo-size','logo-angle','show-logo'])$(id).addEventListener('input',()=>{$('size-value').textContent=`${$('logo-size').value}%`;$('angle-value').textContent=`${$('logo-angle').value}°`;mark();});
$('logo-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  const serial=++uploadSerial;
  if(/image\/(heic|heif)/i.test(file.type)){message('El formato HEIC/HEIF no es compatible. Exportá el logo como PNG, JPG o WebP.');event.target.value='';return;}
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024){message('Elegí un PNG, JPG o WebP de hasta 10 MB.');event.target.value='';return;}
  let url=null;
  try{
    const bitmap=await decodeImage(file,{imageOrientation:'from-image',premultiplyAlpha:'none'});
    if(serial!==uploadSerial){bitmap.close();return;}
    if(bitmap.width<1||bitmap.height<1||bitmap.width*bitmap.height>36000000){bitmap.close();throw Error('La imagen es demasiado grande. Exportala con hasta 6000 × 6000 píxeles.');}
    const max=2048,factor=Math.min(1,max/Math.max(bitmap.width,bitmap.height)),scratch=document.createElement('canvas');
    scratch.width=Math.max(1,Math.round(bitmap.width*factor));scratch.height=Math.max(1,Math.round(bitmap.height*factor));
    scratch.getContext('2d').drawImage(bitmap,0,0,scratch.width,scratch.height);logoAspect=bitmap.width/bitmap.height;bitmap.close();
    renderer.setLogo(scratch);hasLogo=true;
    url=URL.createObjectURL(file);if(logoURL)URL.revokeObjectURL(logoURL);logoURL=url;
    $('logo-preview').src=url;$('logo-name').textContent=file.name;$('logo-summary').hidden=false;$('place-logo').disabled=false;
    if(placement){$('logo-adjustments').disabled=false;message('Logo actualizado sobre la superficie seleccionada.');}else{message('Logo listo. Elegí una ubicación y tocá la carrocería.');}
    $('show-logo').checked=true;updateSteps();mark();
  }catch(error){if(url)URL.revokeObjectURL(url);message(error.message||'No pudimos abrir esa imagen. Probá con otro archivo.');}
});
$('remove-logo').addEventListener('click',()=>{
  uploadSerial++;hasLogo=false;placement=null;$('place-logo').disabled=true;setPlacing(false);$('logo-file').value='';$('logo-summary').hidden=true;$('logo-preview').removeAttribute('src');
  if(logoURL){URL.revokeObjectURL(logoURL);logoURL=null;}
  $('logo-adjustments').disabled=true;$('logo-size').value=100;$('logo-angle').value=0;$('angle-value').textContent='0°';$('size-value').textContent='100%';updateSteps();message('Primero, cargá tu logo.');mark();
});
$('download-image').addEventListener('click',()=>{
 if(!ready||!placement||!hasLogo)return;
 renderer.render(camera,decal());
 canvas.toBlob(blob=>{
  if(!blob){message('No pudimos generar la imagen. Probá nuevamente.');return;}
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='utnba-motorsport-mi-marca.png';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);message('Imagen descargada.');
 },'image/png');
});
updateSteps();
window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);loadController?.abort();renderer?.dispose();if(logoURL)URL.revokeObjectURL(logoURL);});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});

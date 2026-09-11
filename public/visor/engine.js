// Small WebGL2 renderer for this static glTF asset. All textures stay local.
export const add=(a,b)=>a.map((v,i)=>v+b[i]);
export const sub=(a,b)=>a.map((v,i)=>v-b[i]);
export const scale=(a,s)=>a.map(v=>v*s);
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=a=>scale(a,1/(Math.hypot(...a)||1));
export function rotation(q=[0,0,0,1]) {
  const [x,y,z,w]=norm(q);
  return [1-2*y*y-2*z*z,2*x*y-2*z*w,2*x*z+2*y*w,
    2*x*y+2*z*w,1-2*x*x-2*z*z,2*y*z-2*x*w,
    2*x*z-2*y*w,2*y*z+2*x*w,1-2*x*x-2*y*y];
}
const rotate=(m,p)=>[dot(m.slice(0,3),p),dot(m.slice(3,6),p),dot(m.slice(6,9),p)];
export function cameraBasis(yaw,pitch,distance) {
  const eye=[Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance];
  const back=norm(eye),right=norm(cross([0,1,0],back)),up=cross(back,right);
  return {eye,back,right,up};
}
export function cameraMatrix(b,aspect) {
  const {eye,right:x,up:y,back:z}=b;
  const v=[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  const f=1/Math.tan(Math.PI/8),near=.05,far=100;
  const p=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
  const out=new Float32Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=p[k*4+r]*v[c*4+k];
  return out;
}
export function rayDirection(b,x,y,aspect) {
  const t=Math.tan(Math.PI/8);
  return norm(add(scale(b.back,-1),add(scale(b.right,x*aspect*t),scale(b.up,y*t))));
}
export function parseGLB(buffer) {
  const dv=new DataView(buffer);
  if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw Error('El archivo no es un GLB 2.0 válido.');
  const size=dv.getUint32(12,true),g=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,size)));
  if(g.extensionsRequired?.length)throw Error('Este modelo requiere una extensión no compatible.');
  const base=28+size;
  const access=index=>{
    const a=g.accessors[index],v=g.bufferViews[a.bufferView];
    const T={5126:Float32Array,5125:Uint32Array,5123:Uint16Array}[a.componentType];
    const components={SCALAR:1,VEC2:2,VEC3:3}[a.type];
    if(!T||!components||v.byteStride||a.sparse)throw Error('Formato de geometría no compatible.');
    return new T(buffer,base+(v.byteOffset||0)+(a.byteOffset||0),a.count*components);
  };
  let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  const meshes=[];
  for(const nodeIndex of g.scenes[g.scene||0].nodes) {
    const node=g.nodes[nodeIndex];if(node.mesh===undefined)continue;
    const r=rotation(node.rotation),s=node.scale||[1,1,1],t=node.translation||[0,0,0];
    for(const primitive of g.meshes[node.mesh].primitives) {
      const src=access(primitive.attributes.POSITION),sn=access(primitive.attributes.NORMAL);
      const positions=new Float32Array(src.length),normals=new Float32Array(src.length);
      for(let i=0;i<src.length;i+=3) {
        const v=add(rotate(r,[src[i]*s[0],src[i+1]*s[1],src[i+2]*s[2]]),t);
        const n=norm(rotate(r,[sn[i]/s[0],sn[i+1]/s[1],sn[i+2]/s[2]]));
        for(let k=0;k<3;k++){positions[i+k]=v[k];normals[i+k]=n[k];min[k]=Math.min(min[k],v[k]);max[k]=Math.max(max[k],v[k]);}
      }
      meshes.push({positions,normals,uv:access(primitive.attributes.TEXCOORD_0),indices:access(primitive.indices),material:primitive.material,body:node.name.startsWith('FSAE_UTN'),name:node.name});
    }
  }
  const center=scale(add(min,max),.5),factor=6/Math.max(...sub(max,min));
  for(const m of meshes){
    m.min=[Infinity,Infinity,Infinity];m.max=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<m.positions.length;i++){
      const k=i%3,v=(m.positions[i]-center[k])*factor;m.positions[i]=v;
      m.min[k]=Math.min(m.min[k],v);m.max[k]=Math.max(m.max[k],v);
    }
  }
  const imageBlobs=g.images.map(im=>{const v=g.bufferViews[im.bufferView];return new Blob([new Uint8Array(buffer,base+(v.byteOffset||0),v.byteLength)],{type:im.mimeType});});
  return {meshes,imageBlobs,materials:g.materials,textures:g.textures};
}
function intersectsBox(o,d,min,max) {
  let lo=0,hi=Infinity;
  for(let k=0;k<3;k++) {
    if(Math.abs(d[k])<1e-10){if(o[k]<min[k]||o[k]>max[k])return false;continue;}
    let a=(min[k]-o[k])/d[k],b=(max[k]-o[k])/d[k];if(a>b)[a,b]=[b,a];lo=Math.max(lo,a);hi=Math.min(hi,b);
    if(hi<lo)return false;
  }
  return true;
}
export function raycast(meshes,origin,dir) {
  let best=Infinity,hit=null;
  for(const mesh of meshes) {
    if(!intersectsBox(origin,dir,mesh.min,mesh.max))continue;
    const p=mesh.positions,indices=mesh.indices,n=mesh.normals;
    for(let i=0;i<indices.length;i+=3){
      const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3;
      const e1x=p[ib]-p[ia],e1y=p[ib+1]-p[ia+1],e1z=p[ib+2]-p[ia+2];
      const e2x=p[ic]-p[ia],e2y=p[ic+1]-p[ia+1],e2z=p[ic+2]-p[ia+2];
      const px=dir[1]*e2z-dir[2]*e2y,py=dir[2]*e2x-dir[0]*e2z,pz=dir[0]*e2y-dir[1]*e2x;
      const det=e1x*px+e1y*py+e1z*pz;if(Math.abs(det)<1e-9)continue;
      const inv=1/det,tx=origin[0]-p[ia],ty=origin[1]-p[ia+1],tz=origin[2]-p[ia+2];
      const u=(tx*px+ty*py+tz*pz)*inv;if(u<0||u>1)continue;
      const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x;
      const v=(dir[0]*qx+dir[1]*qy+dir[2]*qz)*inv;if(v<0||u+v>1)continue;
      const distance=(e2x*qx+e2y*qy+e2z*qz)*inv;
      if(distance<=.00001||distance>=best)continue;
      best=distance;
      let normal=norm([0,1,2].map(k=>n[ia+k]*(1-u-v)+n[ib+k]*u+n[ic+k]*v));
      if(dot(normal,dir)>0)normal=scale(normal,-1);
      hit={point:add(origin,scale(dir,distance)),normal,body:mesh.body,distance,uv:mesh.uv?[0,1].map(k=>mesh.uv[indices[i]*2+k]*(1-u-v)+mesh.uv[indices[i+1]*2+k]*u+mesh.uv[indices[i+2]*2+k]*v):null};
    }
  }
  return hit;
}
const vertex=`#version 300 es
precision highp float;
layout(location=0) in vec3 position;layout(location=1) in vec3 normal;layout(location=2) in vec2 uv;
uniform mat4 viewProjection;out vec3 world;out vec3 surfaceNormal;out vec2 texcoord;
void main(){world=position;surfaceNormal=normal;texcoord=uv;gl_Position=viewProjection*vec4(position,1.);}`;
const fragment=`#version 300 es
precision highp float;
in vec3 world;in vec3 surfaceNormal;in vec2 texcoord;out vec4 outColor;
uniform sampler2D baseTexture;uniform sampler2D logoTexture;uniform vec3 eye;uniform bool bodyMaterial;uniform bool floorSurface;
uniform sampler2D institutionTexture;uniform vec4 institutionBoxes[2];uniform sampler2D numberTexture;uniform vec4 numberBoxes[3];uniform sampler2D reservationTexture;uniform vec4 logoBox;uniform bool logoMirror;uniform bool hasLogo;uniform vec3 logoCenter;uniform vec3 logoNormal;uniform vec3 logoRight;uniform vec3 logoUp;uniform vec2 logoSize;
void main(){
 vec4 tex=texture(baseTexture,texcoord);if(tex.a<.1)discard;
 // Keep the original side livery. Only the upper nose panels are plain red;
 // the previously removed team wordmarks stay cleared for sponsor placement.
 if(bodyMaterial){
  bool leftWordmark=texcoord.x>.312&&texcoord.x<.379&&texcoord.y>.080&&texcoord.y<.113;
  bool rightWordmark=texcoord.x>.613&&texcoord.x<.677&&texcoord.y>.080&&texcoord.y<.113;
  bool nosePanels=texcoord.x>.23&&texcoord.x<.59&&texcoord.y>.215&&texcoord.y<.34;
  if(nosePanels||leftWordmark||rightWordmark)tex=vec4(221./255.,14./255.,14./255.,1.);
 }
 vec3 normal=normalize(surfaceNormal);if(!gl_FrontFacing)normal=-normal;
 if(floorSurface||(bodyMaterial&&world.y<-.75&&normal.y<-.55))tex=vec4(.018,.018,.018,1.);
 vec3 base=pow(max(tex.rgb,vec3(0.)),vec3(2.2));
 if(hasLogo){
  bool mirrored=logoMirror&&world.x*logoCenter.x<0.;
  vec3 sampleWorld=world;vec3 sampleNormal=normal;
  if(mirrored){sampleWorld.x=-sampleWorld.x;sampleNormal.x=-sampleNormal.x;}
  vec3 rel=sampleWorld-logoCenter;vec2 coord=vec2(dot(rel,logoRight)/logoSize.x+.5,.5-dot(rel,logoUp)/logoSize.y);
  if(mirrored)coord.x=1.-coord.x;
  bool blocked=false;
  for(int i=0;i<3;i++){vec4 box=numberBoxes[i];vec2 at=(texcoord-box.xy)/box.zw;if(all(greaterThanEqual(at,vec2(0.)))&&all(lessThanEqual(at,vec2(1.))))blocked=true;}
  if(texcoord.x>=.304&&texcoord.x<=.336&&texcoord.y>=.2825&&texcoord.y<=.2995)blocked=true;
  if(texcoord.x>=.472&&texcoord.x<=.490&&texcoord.y>=.166&&texcoord.y<=.186)blocked=true;
  if(texcoord.y>=.074&&texcoord.y<=.0984&&((texcoord.x>=.3803&&texcoord.x<=.4163)||(texcoord.x>=.5743&&texcoord.x<=.6103)))blocked=true;
  if(!blocked&&all(greaterThanEqual(coord,vec2(0.)))&&all(lessThanEqual(coord,vec2(1.)))&&abs(dot(rel,logoNormal))<.09&&dot(sampleNormal,logoNormal)>.45){
   vec4 logo=texture(logoTexture,coord);base=mix(base,pow(max(logo.rgb,vec3(0.)),vec3(2.2)),logo.a);
  }
 }
 if(bodyMaterial){
  vec4 reservation=texture(reservationTexture,texcoord);base=mix(base,pow(reservation.rgb,vec3(2.2)),reservation.a);
  for(int i=0;i<2;i++){
   vec4 box=institutionBoxes[i];vec2 at=(texcoord-box.xy)/box.zw;
   vec2 dx=dFdx(texcoord)/box.zw,dy=dFdy(texcoord)/box.zw;
   // Both side UV islands already read left-to-right from their outside view.
   if(all(greaterThanEqual(at,vec2(0.)))&&all(lessThanEqual(at,vec2(1.)))){
    vec4 mark=textureGrad(institutionTexture,at,dx,dy);base=mix(base,pow(mark.rgb,vec3(2.2)),mark.a);
   }
  }
  for(int i=0;i<3;i++){
   vec4 box=numberBoxes[i];vec2 coord=(texcoord-box.xy)/box.zw;
   vec2 dx=dFdx(texcoord)/box.zw,dy=dFdy(texcoord)/box.zw;
   // Nose U increases toward the viewer's right; V increases toward the cockpit.
   // Canvas image Y runs down: flip V only, not U, to avoid a mirrored numeral.
   if(i==2){coord.y=1.-coord.y;dx.y=-dx.y;dy.y=-dy.y;}
   if(all(greaterThanEqual(coord,vec2(0.)))&&all(lessThanEqual(coord,vec2(1.)))){
    vec4 badge=textureGrad(numberTexture,coord,dx,dy);
    base=mix(base,pow(badge.rgb,vec3(2.2)),badge.a);
   }
  }
 }
 vec3 light=normalize(vec3(-3.,6.,4.));vec3 fill=normalize(vec3(4.,2.,-3.));
 float diffuse=.36+.62*max(dot(normal,light),0.)+.23*max(dot(normal,fill),0.);
 vec3 halfDir=normalize(light+normalize(eye-world));float spec=pow(max(dot(normal,halfDir),0.),48.)*.12;
 vec3 color=base*diffuse+vec3(floorSurface?0.:spec);outColor=vec4(pow(clamp(color,0.,1.),vec3(1./2.2)),1.);
}`;
export class CarRenderer {
  constructor(canvas,model) {
    this.canvas=canvas;this.model=model;this.gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'high-performance'});
    if(!this.gl)throw Error('Tu navegador no tiene WebGL 2 disponible. Probá con Chrome o Edge con aceleración gráfica.');
    const gl=this.gl,compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    this.program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(this.program,vs);gl.attachShader(this.program,fs);gl.linkProgram(this.program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));
    this.uniforms={};for(const name of ['viewProjection','baseTexture','logoTexture','eye','bodyMaterial','floorSurface','reservationTexture','numberTexture','institutionTexture','institutionBoxes[0]','numberBoxes[0]','logoBox','logoMirror','hasLogo','logoCenter','logoNormal','logoRight','logoUp','logoSize'])this.uniforms[name]=gl.getUniformLocation(this.program,name);
    this.buffers=[];
    this.draws=model.meshes.map(m=>{
      const vao=gl.createVertexArray();gl.bindVertexArray(vao);
      for(const [location,array,size] of [[0,m.positions,3],[1,m.normals,3],[2,m.uv,2]]){
        const buffer=gl.createBuffer();this.buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0);
      }
      const index=gl.createBuffer();this.buffers.push(index);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
      return {vao,count:m.indices.length,type:m.indices instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,body:m.body,floor:Boolean(m.floor),material:m.material};
    });
    this.textures=[];this.logoTexture=null;this.reservationTexture=null;this.numberTexture=null;this.institutionTexture=null;this.institutionBoxes=new Float32Array(8);this.numberBoxes=new Float32Array(12);this.anisotropy=gl.getExtension('EXT_texture_filter_anisotropic');gl.bindVertexArray(null);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  }
  texture(image){const gl=this.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(this.anisotropy)gl.texParameterf(gl.TEXTURE_2D,this.anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(16,gl.getParameter(this.anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));return t;}
  async initTextures(){for(const blob of this.model.imageBlobs){const im=await createImageBitmap(blob,{imageOrientation:'none',premultiplyAlpha:'none'});this.textures.push(this.texture(im));im.close();}this.logoTexture=this.texture(new ImageData(new Uint8ClampedArray([255,255,255,0]),1,1));}
  setReservations(image){if(this.reservationTexture)this.gl.deleteTexture(this.reservationTexture);this.reservationTexture=this.texture(image);}
  setInstitution(image,boxes){if(this.institutionTexture)this.gl.deleteTexture(this.institutionTexture);this.institutionTexture=this.texture(image);this.institutionBoxes=new Float32Array(boxes.flat());}
  setNumbers(image,boxes){if(this.numberTexture)this.gl.deleteTexture(this.numberTexture);this.numberTexture=this.texture(image);this.numberBoxes=new Float32Array(boxes.flat());}
  setLogo(image){const next=this.texture(image);if(this.logoTexture)this.gl.deleteTexture(this.logoTexture);this.logoTexture=next;}
  render(camera,logo){
    const gl=this.gl,c=this.canvas,u=this.uniforms,dpr=Math.min(Math.max(devicePixelRatio||1,2),2.5);
    const w=Math.max(1,Math.round(c.clientWidth*dpr)),h=Math.max(1,Math.round(c.clientHeight*dpr));
    if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
    gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
    const b=cameraBasis(camera.yaw,camera.pitch,camera.distance);gl.uniformMatrix4fv(u.viewProjection,false,cameraMatrix(b,w/h));gl.uniform3fv(u.eye,b.eye);
    gl.uniform1i(u.baseTexture,0);gl.uniform1i(u.logoTexture,1);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.logoTexture);
    gl.uniform1i(u.reservationTexture,2);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,this.reservationTexture||this.logoTexture);
    gl.uniform1i(u.numberTexture,3);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,this.numberTexture||this.logoTexture);
    gl.uniform4fv(u['numberBoxes[0]'],this.numberBoxes);
    gl.uniform1i(u.institutionTexture,4);gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,this.institutionTexture||this.logoTexture);gl.uniform4fv(u['institutionBoxes[0]'],this.institutionBoxes);
    if(logo){gl.uniform1i(u.logoMirror,Boolean(logo.mirror));gl.uniform3fv(u.logoCenter,logo.point);gl.uniform3fv(u.logoNormal,logo.normal);gl.uniform3fv(u.logoRight,logo.right);gl.uniform3fv(u.logoUp,logo.up);gl.uniform2fv(u.logoSize,[logo.width,logo.height]);}

    for(const d of this.draws){gl.uniform1i(u.bodyMaterial,d.body);gl.uniform1i(u.floorSurface,d.floor);gl.uniform1i(u.hasLogo,Boolean(logo&&d.body));gl.activeTexture(gl.TEXTURE0);const index=this.model.materials[d.material].pbrMetallicRoughness.baseColorTexture.index;gl.bindTexture(gl.TEXTURE_2D,this.textures[this.model.textures[index].source]);gl.bindVertexArray(d.vao);gl.drawElements(gl.TRIANGLES,d.count,d.type,0);}
    gl.bindVertexArray(null);
  }
  dispose(){const gl=this.gl;this.buffers.forEach(b=>gl.deleteBuffer(b));this.draws.forEach(d=>gl.deleteVertexArray(d.vao));this.textures.forEach(t=>gl.deleteTexture(t));if(this.logoTexture)gl.deleteTexture(this.logoTexture);if(this.reservationTexture)gl.deleteTexture(this.reservationTexture);if(this.numberTexture)gl.deleteTexture(this.numberTexture);if(this.institutionTexture)gl.deleteTexture(this.institutionTexture);gl.deleteProgram(this.program);}
}

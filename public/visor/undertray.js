// Display-only cleanup of the supplied asset, in normalized model coordinates.
// Clip against the undertray rather than moving or rescaling the source model.
export const FLOOR_Y=-1.025;
export function cleanUnderbody(model,raycast){
 const body=model.meshes.find(m=>m.body);
 if(!body)return;
 const positions=Array.from(body.positions),normals=Array.from(body.normals),uv=Array.from(body.uv),indices=[];
 let clipped=0,removedRail=0;
 // Sample the undisturbed side skin just above the stray lower rail. Remove
 // only its outward-facing fragments on the positive-X side; keep the livery.
 const railProfile=[];
 if(raycast)for(let k=0;k<=24;k++){
  const z=-2.1+k*.1,hit=raycast([body],[4,-.925,z],[-1,0,0]);
  railProfile.push(hit?.point[0]??Infinity);
 }
 const skinX=z=>{
  const t=Math.max(0,Math.min(23.999,(z+2.1)/.1)),i=Math.floor(t);
  return railProfile[i]*(1-(t-i))+railProfile[i+1]*(t-i);
 };
 const intersection=(a,b)=>{
  const t=(FLOOR_Y-positions[a*3+1])/(positions[b*3+1]-positions[a*3+1]);
  const id=positions.length/3;
  for(let k=0;k<3;k++){positions.push(k===1?FLOOR_Y:positions[a*3+k]+t*(positions[b*3+k]-positions[a*3+k]));normals.push(normals[a*3+k]+t*(normals[b*3+k]-normals[a*3+k]));}
  for(let k=0;k<2;k++)uv.push(uv[a*2+k]+t*(uv[b*2+k]-uv[a*2+k]));
  return id;
 };
 for(let i=0;i<body.indices.length;i+=3){
  const tri=[body.indices[i],body.indices[i+1],body.indices[i+2]];
  if(railProfile.length){
   const x=tri.reduce((s,v)=>s+positions[v*3],0)/3;
   const y=tri.reduce((s,v)=>s+positions[v*3+1],0)/3;
   const z=tri.reduce((s,v)=>s+positions[v*3+2],0)/3;
   if(y<-.94&&y>=FLOOR_Y&&z>=-2.1&&z<=.3&&x>skinX(z)+.018){removedRail++;continue;}
  }
  if(tri.every(v=>positions[v*3+1]>=FLOOR_Y)){indices.push(...tri);continue;}
  clipped++;
  const polygon=[];
  for(let k=0;k<3;k++){
   const a=tri[k],b=tri[(k+1)%3],insideA=positions[a*3+1]>=FLOOR_Y,insideB=positions[b*3+1]>=FLOOR_Y;
   if(insideA)polygon.push(a);
   if(insideA!==insideB)polygon.push(intersection(a,b));
  }
  for(let k=1;k<polygon.length-1;k++)indices.push(polygon[0],polygon[k],polygon[k+1]);
 }
 body.positions=new Float32Array(positions);body.normals=new Float32Array(normals);body.uv=new Float32Array(uv);body.indices=new Uint32Array(indices);body.min[1]=FLOOR_Y;
 // Symmetric outline follows the existing lower body footprint. The forward
 // nose beyond this footprint retains its existing sloped underside.
 const profile=[[-2.92,.55],[-2.4,.65],[-1.8,.58],[-1.2,.76],[-.8,.79],[0,.70],[.35,.34],[1.3,.38],[1.5,.26]];
 const fp=[],fn=[],fu=[],fi=[];
 for(const [z,width] of profile){for(const x of [-width,width]){fp.push(x,FLOOR_Y,z);fn.push(0,-1,0);fu.push(0,0);}}
 for(let k=0;k<profile.length-1;k++){const a=k*2;fi.push(a,a+1,a+2,a+1,a+3,a+2);}
 model.meshes.push({name:'Black display undertray',positions:new Float32Array(fp),normals:new Float32Array(fn),uv:new Float32Array(fu),indices:new Uint32Array(fi),material:body.material,body:false,floor:true,min:[-.79,FLOOR_Y,-2.92],max:[.79,FLOOR_Y,1.5]});
 return {clippedTriangles:clipped,removedRailTriangles:removedRail,floorTriangles:fi.length/3};
}

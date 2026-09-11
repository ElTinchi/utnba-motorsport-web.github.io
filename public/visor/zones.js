// Fixed UV placements on this car's texture atlas. Visitors cannot move or resize
// a footprint outside its assigned zone. The two sides are separate options.
// Relative sizes are a layout proposal, not physical dimensions or sponsorship tiers.
const layout = [
 {id:'principal',name:'Principal · franja superior',box:[.380,.095,.068,.025],size:'Grande'},
 {id:'posterior',name:'Mediano · sector trasero',box:[.338,.090,.032,.026],size:'Mediano'},
 {id:'central-a',name:'Mediano · fila central A',box:[.354,.132,.031,.023],size:'Mediano'},
 {id:'central-b',name:'Mediano · fila central B',box:[.395,.132,.031,.023],size:'Mediano'},
 {id:'delantero',name:'Mediano · sector delantero',box:[.436,.137,.030,.023],size:'Mediano'},
 {id:'inferior-a',name:'Pequeño · fila inferior A',box:[.354,.166,.022,.017],size:'Pequeño'},
 {id:'inferior-b',name:'Pequeño · fila inferior B',box:[.386,.166,.022,.017],size:'Pequeño'},
 {id:'inferior-c',name:'Pequeño · fila inferior C',box:[.418,.166,.022,.017],size:'Pequeño'},
];
export const zones = [
 ...layout.map(z=>({...z,id:'l-'+z.id,group:'Lateral izquierdo',label:'Lateral izquierdo · '+z.name,view:'side'})),
 ...layout.map(z=>({...z,id:'r-'+z.id,group:'Lateral derecho',label:'Lateral derecho · '+z.name,box:[1-z.box[0]-z.box[2],z.box[1],z.box[2],z.box[3]],view:'other'})),
];
export const reserved = [
  {id:'fsae1',label:'FSAE · frente vertical',box:[.304,.2825,.032,.017],kind:'fsae',flipX:true},
  {id:'fsae2',label:'FSAE · lateral delantero',box:[.472,.166,.018,.020],kind:'fsae'},
  {id:'utn-left',label:'UTN · lateral izquierdo',box:[.3803,.074,.036,.0244],kind:'utn'},
  {id:'utn-right',label:'UTN · lateral derecho',box:[.5743,.074,.036,.0244],kind:'utn',flipX:true},
  {id:'number-left',label:'Número · lateral izquierdo',box:[.322,.151,.024,.030],kind:'number'},
  {id:'number-right',label:'Número · lateral derecho',box:[.654,.151,.024,.030],kind:'number'},
  // The nose UV is stretched longitudinally: compensate to keep the badge
  // compact on the actual surface, near the cockpit rather than down the nose.
  {id:'number-top',label:'Número · arriba de la trompa',box:[.4813,.2630,.048,.009],kind:'number',uvAspectCorrection:true},
];
export function fitLogo(box,aspect,percent=100){
  const factor=Math.min(1,Math.max(.3,percent/100)),w=box[2]*factor,h=box[3]*factor;
  const width=Math.min(w,h*aspect),height=width/aspect;
  return [box[0]+(box[2]-width)/2,box[1]+(box[3]-height)/2,width,height];
}

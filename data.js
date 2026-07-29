// data.js — seed data + pure calculation helpers (no UI code here)

export const STORAGE_KEY = "naked-alchemist-data-v1";

export const SEED = {
  expenses: [
    {date:"2026-06-23",item:"soap molds",category:"Equipment",cost:10.72,vendor:"Amazon"},
    {date:"2026-06-22",item:"cedarwood oil",category:"Ingredients",cost:7.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"clary sage oil",category:"Ingredients",cost:9.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"digital scale",category:"Equipment",cost:10.64,vendor:"Amazon"},
    {date:"2026-06-22",item:"stainless pitcher",category:"Equipment",cost:14.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"gloves",category:"Equipment",cost:6.90,vendor:"Amazon"},
    {date:"2026-06-22",item:"plastic pitcher",category:"Equipment",cost:16.19,vendor:"Amazon"},
    {date:"2026-06-22",item:"Shea Butter",category:"Equipment",cost:12.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"hand blender",category:"Equipment",cost:14.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"eucalyptus oil",category:"Ingredients",cost:9.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"goggles",category:"Equipment",cost:4.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"castor oil",category:"Ingredients",cost:7.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"coconut oil",category:"Ingredients",cost:7.20,vendor:"Amazon"},
    {date:"2026-06-22",item:"lye",category:"Ingredients",cost:19.99,vendor:"Amazon"},
    {date:"2026-06-22",item:"spatula",category:"Equipment",cost:5.99,vendor:"Amazon"},
    {date:"2026-06-29",item:"thermometers",category:"Equipment",cost:20.00,vendor:"Amazon"},
    {date:"2026-07-11",item:"syringes",category:"Equipment",cost:1.96,vendor:"Hobby Lobby"},
    {date:"2026-07-11",item:"Bergamont oil",category:"Ingredients",cost:9.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"Cypress Oil",category:"Ingredients",cost:9.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"Lavendar oil",category:"Ingredients",cost:8.49,vendor:"Amazon"},
    {date:"2026-07-11",item:"White grapefruit oil",category:"Ingredients",cost:18.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"black pepper",category:"Ingredients",cost:9.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"rose geranium",category:"Ingredients",cost:12.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"Frankincense oil",category:"Ingredients",cost:12.99,vendor:"Amazon"},
    {date:"2026-07-11",item:"vetiver Oil",category:"Ingredients",cost:9.38,vendor:"Amazon"},
    {date:"2026-07-11",item:"Dark patchouli oil",category:"Ingredients",cost:12.95,vendor:"Amazon"},
    {date:"2026-07-11",item:"Wicked",category:"Ingredients",cost:5.50,vendor:"Mad Mica"},
    {date:"2026-07-11",item:"Tahitian Teal",category:"Ingredients",cost:5.50,vendor:"Mad Mica"},
    {date:"2026-07-11",item:"Velvet Plum",category:"Ingredients",cost:6.95,vendor:"Mad Mica"},
    {date:"2026-07-11",item:"Flotation Device Orange",category:"Ingredients",cost:6.75,vendor:"Mad Mica"},
    {date:"",item:"Paper",category:"Ingredients",cost:7.99,vendor:"Amazon"},
    {date:"",item:"Paper cutter",category:"Equipment",cost:10.99,vendor:"Amazon"},
    {date:"",item:"Glue point",category:"Ingredients",cost:3.99,vendor:"Amazon"},
    {date:"",item:"lye",category:"Ingredients",cost:20.00,vendor:""},
    {date:"",item:"shea butter",category:"Ingredients",cost:54.00,vendor:""},
    {date:"",item:"stainless pitcher",category:"Equipment",cost:21.00,vendor:""},
    {date:"",item:"silicone mold",category:"Equipment",cost:9.99,vendor:""},
    {date:"",item:"castor oil",category:"Ingredients",cost:17.99,vendor:""},
    {date:"",item:"White Kaolin Clay",category:"Ingredients",cost:11.95,vendor:""},
    {date:"",item:"colloidal oatmeal",category:"Ingredients",cost:17.95,vendor:""},
    {date:"",item:"printer ink",category:"Ingredients",cost:9.67,vendor:""},
    {date:"",item:"olive oil",category:"Ingredients",cost:35.94,vendor:""},
    {date:"",item:"coconut oil",category:"Ingredients",cost:20.48,vendor:""},
    {date:"",item:"parchment paper",category:"Ingredients",cost:2.96,vendor:""},
    {date:"",item:"Gloves",category:"Equipment",cost:7.75,vendor:""},
    {date:"",item:"stickers",category:"Shipping",cost:7.99,vendor:""},
    {date:"",item:"drying rack",category:"Equipment",cost:24.99,vendor:""},
    {date:"",item:"large box",category:"Shipping",cost:18.99,vendor:""},
    {date:"",item:"medium box",category:"Shipping",cost:19.99,vendor:""},
    {date:"",item:"small box",category:"Shipping",cost:16.63,vendor:""},
    {date:"",item:"thermal printer",category:"Equipment",cost:33.99,vendor:""},
    {date:"",item:"shipping labels",category:"Shipping",cost:7.99,vendor:""}
  ],
  sales: [
    {date:"2026-06-22",product:"Vapor Exhale",qty:1,batch:"VE001",unitPrice:8.00,boxSize:"Medium",shippingCost:1.84,channel:""}
  ],
  rawMaterials: [
    {name:"lye",category:"Lye",price:19.99,weight:906,unit:"g"},
    {name:"water",category:"Water",price:1.44,weight:3785.4,unit:"g"},
    {name:"cedarwood oil",category:"Essential Oils",price:7.99,weight:30,unit:"g"},
    {name:"clary sage oil",category:"Essential Oils",price:9.99,weight:30,unit:"g"},
    {name:"eucalyptus oil",category:"Essential Oils",price:9.99,weight:118,unit:"g"},
    {name:"Bergamont oil",category:"Essential Oils",price:9.99,weight:26.4,unit:"g"},
    {name:"Cypress Oil",category:"Essential Oils",price:9.99,weight:26.4,unit:"g"},
    {name:"Lavendar oil",category:"Essential Oils",price:8.49,weight:27,unit:"g"},
    {name:"White grapefruit oil",category:"Essential Oils",price:18.99,weight:100.3,unit:"g"},
    {name:"black pepper",category:"Essential Oils",price:9.99,weight:26.4,unit:"g"},
    {name:"rose geranium",category:"Essential Oils",price:12.99,weight:106.2,unit:"g"},
    {name:"Frankincense oil",category:"Essential Oils",price:12.99,weight:90,unit:"g"},
    {name:"vetiver Oil",category:"Essential Oils",price:9.38,weight:100,unit:"g"},
    {name:"Dark patchouli oil",category:"Essential Oils",price:12.95,weight:28.5,unit:"g"},
    {name:"Shea Butter",category:"Base Oils",price:54.00,weight:4536,unit:"g"},
    {name:"castor oil",category:"Base Oils",price:17.99,weight:907,unit:"g"},
    {name:"coconut oil",category:"Base Oils",price:20.48,weight:1842,unit:"g"},
    {name:"olive oil",category:"Base Oils",price:35.94,weight:2000,unit:"g"},
    {name:"Wicked",category:"Mica Powder",price:5.50,weight:23,unit:"g"},
    {name:"Tahitian Teal",category:"Mica Powder",price:5.50,weight:23,unit:"g"},
    {name:"Velvet Plum",category:"Mica Powder",price:6.95,weight:23,unit:"g"},
    {name:"Flotation Device Orange",category:"Mica Powder",price:6.75,weight:23,unit:"g"},
    {name:"Paper",category:"Label",price:7.99,weight:20,unit:"sheets"},
    {name:"Glue dots",category:"Label",price:3.99,weight:200,unit:"dots"},
    {name:"White Kaolin Clay",category:"Essential Oils",price:11.95,weight:454,unit:"g"},
    {name:"colloidal oatmeal",category:"Essential Oils",price:17.95,weight:397,unit:"g"},
    {name:"Parchment paper",category:"Supplies",price:2.96,weight:50,unit:"sheets"},
    {name:"Gloves",category:"Supplies",price:7.19,weight:100,unit:"pairs"},
    {name:"Small Box",category:"Shipping",price:16.63,weight:40,unit:"ea"},
    {name:"Medium Box",category:"Shipping",price:19.99,weight:25,unit:"ea"},
    {name:"Large Box",category:"Shipping",price:18.99,weight:25,unit:"ea"},
    {name:"Shipping Label",category:"Shipping",price:6.99,weight:240,unit:"ea"},
    {name:"Brand Sticker",category:"Shipping",price:7.99,weight:750,unit:"ea"},
    {name:"Crinkle Paper",category:"Shipping",price:60.00,weight:60,unit:"g"}
  ],
  inventory: {
    "lye":810.3,"water":3561.8,"Shea Butter":178.6,"olive oil":241.8,"coconut oil":306.7,
    "castor oil":201.5,"eucalyptus oil":105.7,"clary sage oil":23.7,"cedarwood oil":27.7,
    "Bergamont oil":26.4,"Cypress Oil":26.4,"Lavendar oil":27,"White grapefruit oil":100.3,
    "black pepper":26.4,"rose geranium":106.2,"Frankincense oil":90,"vetiver Oil":100,
    "Dark patchouli oil":28.5,"Wicked":23,"Tahitian Teal":23,"Velvet Plum":23,
    "Flotation Device Orange":23,"Paper":20,"Glue dots":200,"White Kaolin Clay":454,"colloidal oatmeal":397
  },
  recipes: [
    {name:"Vapor Exhale",batchYield:16,retailPrice:8.00,
     oils:[{name:"eucalyptus oil",amt:25.5},{name:"cedarwood oil",amt:4.3},{name:"clary sage oil",amt:12.7}],
     lye:191.4,water:446.4,
     fats:[{name:"Shea Butter",amt:548.4},{name:"olive oil",amt:479.85},{name:"castor oil",amt:68.4},{name:"coconut oil",amt:20}],
     label:0.22,parchment:2.5},
    {name:"Kinetic Catalyst",batchYield:16,retailPrice:8.00,
     oils:[{name:"Bergamont oil",amt:21.3},{name:"White grapefruit oil",amt:14.2},{name:"Frankincense oil",amt:7.1}],
     lye:191.4,water:446.4,
     fats:[{name:"Shea Butter",amt:548.4},{name:"olive oil",amt:479.85},{name:"castor oil",amt:68.4},{name:"coconut oil",amt:20}],
     label:0.22,parchment:2.5},
    {name:"Earthen Anchor",batchYield:16,retailPrice:8.00,
     oils:[{name:"Cypress Oil",amt:25.5},{name:"black pepper",amt:8.5},{name:"vetiver Oil",amt:8.5}],
     lye:191.4,water:446.4,
     fats:[{name:"Shea Butter",amt:548.4},{name:"olive oil",amt:479.85},{name:"castor oil",amt:68.4},{name:"coconut oil",amt:20}],
     label:0.22,parchment:2.5},
    {name:"Mercurial Trance",batchYield:16,retailPrice:8.00,
     oils:[{name:"Lavendar oil",amt:21.3},{name:"rose geranium",amt:14.2},{name:"Dark patchouli oil",amt:7.1}],
     lye:191.4,water:446.4,
     fats:[{name:"Shea Butter",amt:548.4},{name:"olive oil",amt:479.85},{name:"castor oil",amt:68.4},{name:"coconut oil",amt:20}],
     label:0.22,parchment:2.5},
    {name:"Raw Restore",batchYield:16,retailPrice:8.00,
     oils:[{name:"White Kaolin Clay",amt:9},{name:"colloidal oatmeal",amt:45}],
     lye:191.4,water:446.4,
     fats:[{name:"Shea Butter",amt:548.4},{name:"olive oil",amt:479.85},{name:"castor oil",amt:68.4},{name:"coconut oil",amt:20}],
     label:0.22,parchment:2.5}
  ],
  products: [
    {base:"Eucalyptus Sage",name:"Vapor Exhale",desc:"A high-pressure botanical purge. Volatile eucalyptus and raw sage aggressively clear the airways, acting as an emergency release valve for the day's toxicity.",tagline:"Vent the venom",color:"#3E7C74",mica:"Tahitian teal"},
    {base:"Citrus",name:"Kinetic Catalyst",desc:"A deliberate shock to the nervous system. Bright citrus and ancient frankincense engineered to shatter morning inertia. Don't just wake up.",tagline:"Dominate the dawn",color:"#D9782D",mica:"Flotation device orange"},
    {base:"Earthy",name:"Earthen Anchor",desc:"Formulated for the days that spin out of control. Heavy vetiver roots and sharp cypress pull you out of your head and drop you firmly back into your body.",tagline:"Anchor the anarchy",color:"#3A3733",mica:"Wicked"},
    {base:"Floral",name:"Mercurial Trance",desc:"This is not a polite floral. Dark patchouli drags raw lavender down into a heavy, unapologetic trance. Shut down the conscious mind and lean into the shift.",tagline:"Mutate the mind",color:"#6B4A72",mica:"Velvet plum"},
    {base:"Unscented",name:"Raw Restore",desc:"The ultimate reset. Zero fragrance, zero variables, zero friction. Pure colloidal oatmeal and kaolin clay engineered to eliminate the noise and scrub the static.",tagline:"Scrub the static",color:"#C7BFA9",mica:""}
  ],
  batches: [
    {lot:"VE001",date:"2026-07-02",recipe:"Vapor Exhale",yield:16,demoldDate:"2026-07-05",fullCureDate:"2026-11-02",notes:"",
     weights:{"lye":95.7,"water":223.6,"Shea Butter":274.4,"olive oil":240.2,"coconut oil":137.3,"castor oil":34.5,"eucalyptus oil":12.3,"cedarwood oil":2.3,"clary sage oil":6.3,"mica":0},
     consumption:{"lye":95.7,"water":223.6,"Shea Butter":274.4,"olive oil":240.2,"coconut oil":137.3,"castor oil":34.5,"eucalyptus oil":12.3,"cedarwood oil":2.3,"clary sage oil":6.3}}
  ],
  productStockAdjustment: {}
};

export const PACK_SAMPLE = "5 Bar Sample Pack";
export const PACK_CUSTOM = "3 Bar Custom Pack";

export function getMaterial(data, name){ return data.rawMaterials.find(m=>m.name===name); }
export function costPerUnit(data, name){ const m=getMaterial(data,name); return m && m.weight ? m.price/m.weight : 0; }

export function computeRecipe(data, r){
  const oils = r.oils.map(o=>({...o, cost: costPerUnit(data,o.name)*o.amt}));
  const fats = r.fats.map(o=>({...o, cost: costPerUnit(data,o.name)*o.amt}));
  const lyeCost = costPerUnit(data,"lye")*r.lye;
  const waterCost = costPerUnit(data,"water")*r.water;
  const parchmentCost = costPerUnit(data,"Parchment paper")*r.parchment;
  const totalBatchCost = oils.reduce((s,o)=>s+o.cost,0) + fats.reduce((s,o)=>s+o.cost,0) + lyeCost + waterCost + Number(r.label) + parchmentCost;
  const perBarCost = r.batchYield ? totalBatchCost/r.batchYield : 0;
  const margin = r.retailPrice - perBarCost;
  const marginPct = perBarCost ? (margin/perBarCost)*100 : 0;
  return {oils, fats, lyeCost, waterCost, parchmentCost, totalBatchCost, perBarCost, margin, marginPct};
}

export function packingCost(data, boxSize){
  const boxName = boxSize+" Box";
  return costPerUnit(data,boxName) + costPerUnit(data,"Crinkle Paper") + costPerUnit(data,"Shipping Label") + costPerUnit(data,"Brand Sticker");
}

export function totalRevenue(data){ return data.sales.reduce((s,r)=> s + (Number(r.unitPrice)*Number(r.qty) - Number(r.shippingCost||0)), 0); }
export function totalExpenses(data){ return data.expenses.reduce((s,r)=> s + Number(r.cost||0), 0); }
export function netProfit(data){ return totalRevenue(data) - totalExpenses(data); }
export function profitMargin(data){ const rev=totalRevenue(data); return rev===0?0:(netProfit(data)/rev)*100; }

export function stockPct(data, name){
  const initial = SEED.rawMaterials.find(m=>m.name===name);
  const current = data.inventory[name];
  if(current==null || !initial) return null;
  return Math.max(0, Math.min(100, (current/initial.weight)*100));
}

export function buildConsumption(recipe){
  const c = {lye:recipe.lye, water:recipe.water};
  recipe.fats.forEach(f=>{ c[f.name] = (c[f.name]||0) + f.amt; });
  recipe.oils.forEach(o=>{ c[o.name] = (c[o.name]||0) + o.amt; });
  return c;
}

export function applyConsumption(data, consumption, sign){
  const inventory = {...data.inventory};
  Object.keys(consumption).forEach(name=>{
    if(inventory[name]!=null){ inventory[name] += sign * consumption[name]; }
  });
  return {...data, inventory};
}

export function getMicaMaterialName(data, recipeName){
  const p = data.products.find(p=>p.name===recipeName);
  if(!p || !p.mica) return null;
  const m = data.rawMaterials.find(m=>m.name.toLowerCase()===p.mica.toLowerCase());
  return m ? m.name : p.mica;
}

export function addDays(dateStr, days){
  if(!dateStr) return "";
  const d = new Date(dateStr+"T00:00:00");
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
}
export function addMonths(dateStr, months){
  if(!dateStr) return "";
  const d = new Date(dateStr+"T00:00:00");
  d.setMonth(d.getMonth()+months);
  return d.toISOString().slice(0,10);
}

export function getSaleScentContributions(data, sale){
  if(sale.product===PACK_SAMPLE){
    return data.products.map(p=>({scent:p.name, qty:1*Number(sale.qty||1)}));
  }
  if(sale.product===PACK_CUSTOM){
    return (sale.components||[]).filter(Boolean).map(scent=>({scent, qty:1*Number(sale.qty||1)}));
  }
  return [{scent:sale.product, qty:Number(sale.qty||0)}];
}

export function productDemand(data){
  const soldMap = {}, revMap = {};
  data.sales.forEach(s=>{
    const rev = s.unitPrice*s.qty-(s.shippingCost||0);
    const contributions = getSaleScentContributions(data, s);
    const totalQty = contributions.reduce((sum,c)=>sum+c.qty,0) || 1;
    contributions.forEach(c=>{
      soldMap[c.scent] = (soldMap[c.scent]||0) + c.qty;
      revMap[c.scent] = (revMap[c.scent]||0) + rev*(c.qty/totalQty);
    });
  });
  return data.products.map(p=>{
    const soldQty = soldMap[p.name]||0;
    const soldRevenue = revMap[p.name]||0;
    const producedQty = data.batches.filter(b=>b.recipe===p.name).reduce((s,b)=>s+Number(b.yield||0),0);
    const adjustment = data.productStockAdjustment[p.name]||0;
    const stock = adjustment + producedQty - soldQty;
    return {...p, soldQty, soldRevenue, producedQty, adjustment, stock};
  }).sort((a,b)=>b.soldQty-a.soldQty);
}

export const fmt$ = n => "$" + (Number(n)||0).toFixed(2);
export const fmtNum = n => { const v=Number(n)||0; return v.toFixed(1).replace(/\.0$/,''); };

const products = [
  {id:1,name:"Placa de vídeo Radeon RX 580",category:"Placas de vídeo",price:649.90,desc:"Exemplo de placa para jogos em Full HD.",emoji:"🎮",tag:"POPULAR",code:"GPU / PCS-001"},
  {id:2,name:"Processador AMD Ryzen 5",category:"Processadores",price:589.90,desc:"Exemplo de processador para setup gamer.",emoji:"▦",tag:"DESTAQUE",code:"CPU / PCS-002"},
  {id:3,name:"Memória RAM DDR4 16 GB",category:"Memória RAM",price:219.90,desc:"Exemplo de memória para PCs compatíveis.",emoji:"▤",tag:"UPGRADE",code:"RAM / PCS-003"},
  {id:4,name:"Placa-mãe AM4 DDR4",category:"Placas-mãe",price:399.90,desc:"Confira socket, chipset e BIOS antes de comprar.",emoji:"▦",tag:"",code:"MB / PCS-004"},
  {id:5,name:"Teclado mecânico gamer",category:"Acessórios",price:159.90,desc:"Exemplo de periférico para seu setup.",emoji:"⌨",tag:"SETUP",code:"GEAR / PCS-005"},
  {id:6,name:"Mouse gamer RGB",category:"Acessórios",price:89.90,desc:"Exemplo de acessório para jogos e uso diário.",emoji:"🖱",tag:"",code:"GEAR / PCS-006"}
];
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let category = "Todos";
let cart = JSON.parse(localStorage.getItem("pcs-cart") || "{}");
const grid = document.getElementById("product-grid");
const search = document.getElementById("search");
function save(){localStorage.setItem("pcs-cart",JSON.stringify(cart));renderCart();updateCount();}
function renderProducts(){
 const q=search.value.trim().toLocaleLowerCase("pt-BR");
 const list=products.filter(p=>(category==="Todos"||p.category===category)&&(`${p.name} ${p.category} ${p.desc}`).toLocaleLowerCase("pt-BR").includes(q));
 document.getElementById("result-count").textContent=`${list.length} ${list.length===1?"produto":"produtos"}`;
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-art"><span class="code">${p.code}</span>${p.tag?`<span class="tag">${p.tag}</span>`:""}<span class="emoji">${p.emoji}</span></div><div class="product-info"><span class="category">${p.category}</span><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-buy"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+ Adicionar</button></div></div></article>`).join(""):`<p class="empty-cart">Nenhum produto encontrado. Tente outra busca.</p>`;
}
function updateCount(){document.getElementById("cart-count").textContent=Object.values(cart).reduce((a,b)=>a+b,0);}
function renderCart(){
 const entries=products.filter(p=>cart[p.id]);
 const box=document.getElementById("cart-items");
 box.innerHTML=entries.length?entries.map(p=>`<div class="cart-item"><div><b>${p.name}</b><small>${money(p.price)} cada</small><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Diminuir">−</button><span>${cart[p.id]}</span><button data-change="${p.id}" data-delta="1" aria-label="Aumentar">+</button></div></div><div style="text-align:right"><b>${money(p.price*cart[p.id])}</b><br><button class="remove" data-remove="${p.id}">Remover</button></div></div>`).join(""):`<div class="empty-cart">Seu carrinho ainda está vazio.<br>Adicione produtos para começar.</div>`;
 const total=entries.reduce((sum,p)=>sum+p.price*cart[p.id],0);
 document.getElementById("cart-total").textContent=money(total);
 document.getElementById("checkout-button").disabled=!entries.length;
 document.getElementById("checkout-button").style.opacity=entries.length?1:.5;
}
function openCart(){document.getElementById("cart-panel").classList.add("open");document.getElementById("cart-panel").setAttribute("aria-hidden","false");document.getElementById("overlay").hidden=false;document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("cart-panel").classList.remove("open");document.getElementById("cart-panel").setAttribute("aria-hidden","true");document.getElementById("overlay").hidden=true;document.body.style.overflow="";}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;cart[id]=(cart[id]||0)+1;save();b.textContent="Adicionado ✓";setTimeout(()=>{if(b.isConnected)b.textContent="+ Adicionar"},900);});
document.getElementById("cart-items").addEventListener("click",e=>{const c=e.target.closest("[data-change]"),r=e.target.closest("[data-remove]");if(c){const id=c.dataset.change;cart[id]=(cart[id]||0)+Number(c.dataset.delta);if(cart[id]<=0)delete cart[id];save();}if(r){delete cart[r.dataset.remove];save();}});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;renderProducts();}));
search.addEventListener("input",renderProducts);
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkout-button").addEventListener("click",()=>{closeCart();document.getElementById("checkout-message").textContent="";document.getElementById("checkout-dialog").showModal();});
document.getElementById("checkout-form").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.currentTarget);const items=products.filter(p=>cart[p.id]).map(p=>`${cart[p.id]}x ${p.name} — ${money(p.price*cart[p.id])}`).join("\n");const total=products.reduce((s,p)=>s+p.price*(cart[p.id]||0),0);document.getElementById("checkout-message").textContent=`Pedido demonstrativo criado!\\nCliente: ${data.get("name")}\\nPagamento escolhido: ${data.get("payment")}\\nItens:\\n${items}\\nSubtotal: ${money(total)}\\n\\nNenhum pagamento foi realizado. Para vender de verdade, conecte um provedor de pagamento e um backend seguro.`;});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();updateCount();
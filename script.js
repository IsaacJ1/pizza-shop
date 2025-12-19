const menu = [
  { id: 'm1', name: 'Margherita', desc: 'Tomato, mozzarella, basil', price: 9.5 },
  { id: 'm2', name: 'Pepperoni', desc: 'Pepperoni, cheese', price: 11.5 },
  { id: 'm3', name: 'Veggie', desc: 'Peppers, onions, mushrooms', price: 10.5 },
  { id: 'm4', name: 'BBQ Chicken', desc: 'Chicken, BBQ sauce, onion', price: 12.0 }
]

const menuEl = document.getElementById('menuItems')
const cartBtn = document.getElementById('cartBtn')
const cartEl = document.getElementById('cart')
const cartItemsEl = document.getElementById('cartItems')
const cartCountEl = document.getElementById('cartCount')
const cartTotalEl = document.getElementById('cartTotal')
const checkoutBtn = document.getElementById('checkoutBtn')
const checkoutModal = document.getElementById('checkoutModal')
const orderForm = document.getElementById('orderForm')
const cancelCheckout = document.getElementById('cancelCheckout')

let cart = JSON.parse(localStorage.getItem('cart')||'[]')

function renderMenu(){
  menuEl.innerHTML = ''
  menu.forEach(item=>{
    const c = document.createElement('div')
    c.className='card'
    c.innerHTML = `<h5>${item.name} — $${item.price.toFixed(2)}</h5><div class="muted">${item.desc}</div><button data-id="${item.id}" class="primary">Add</button>`
    menuEl.appendChild(c)
  })
  menuEl.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.id)))
}

function addToCart(id){
  const item = menu.find(m=>m.id===id)
  const entry = cart.find(c=>c.id===id)
  if(entry) entry.qty++
  else cart.push({id:item.id,name:item.name,price:item.price,qty:1})
  saveAndRenderCart()
}

function saveAndRenderCart(){
  localStorage.setItem('cart',JSON.stringify(cart))
  renderCart()
}

function renderCart(){
  cartItemsEl.innerHTML = ''
  let total=0
  cart.forEach(it=>{
    total += it.price * it.qty
    const row = document.createElement('div')
    row.className='cart-item'
    row.innerHTML = `<div>${it.name} <small class="muted">x${it.qty}</small></div><div>$${(it.price*it.qty).toFixed(2)} <button data-id="${it.id}" class="remove">✕</button></div>`
    cartItemsEl.appendChild(row)
  })
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0)
  cartTotalEl.textContent = total.toFixed(2)
  cartItemsEl.querySelectorAll('.remove').forEach(b=>b.addEventListener('click',()=>{ removeItem(b.dataset.id) }))
}

function removeItem(id){
  cart = cart.map(c=>c.id===id?{...c,qty:c.qty-1}:c).filter(c=>c.qty>0)
  saveAndRenderCart()
}

cartBtn.addEventListener('click',()=>{ cartEl.classList.toggle('hidden') })
checkoutBtn.addEventListener('click',()=>{ if(cart.length===0){alert('Cart is empty');return} checkoutModal.classList.remove('hidden') })
cancelCheckout.addEventListener('click',()=>checkoutModal.classList.add('hidden'))

orderForm.addEventListener('submit',e=>{
  e.preventDefault()
  const data = Object.fromEntries(new FormData(orderForm).entries())
  const order = {id:Date.now(),customer:data,items:cart,total:cart.reduce((s,i)=>s+i.price*i.qty,0)}
  console.log('Order placed',order)
  localStorage.removeItem('cart')
  cart = []
  saveAndRenderCart()
  checkoutModal.classList.add('hidden')
  alert('Thanks! Your order has been placed.')
})

function init(){
  renderMenu()
  renderCart()
}

init()

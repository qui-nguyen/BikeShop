var express = require('express');
var router = express.Router();

// Data of bikes
var dataBike = [
  {name:"BIK045", url:"/images/bike-1.jpg", price:679},
  {name:"ZOOK07", url:"/images/bike-2.jpg", price:999},
  {name:"TITANS", url:"/images/bike-3.jpg", price:799},
  {name:"CEWO", url:"/images/bike-4.jpg", price:1300},
  {name:"AMIG039", url:"/images/bike-5.jpg", price:479},
  {name:"LIK099", url:"/images/bike-6.jpg", price:869},
  {name:"SHIRO9", url:"/images/bike-4.jpg", price:1869},
  {name:"SHIMAP99", url:"/images/bike-2.jpg", price:819},
]

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = [];
  }
  res.render('index', {dataBike:dataBike});
});

// Router basket page
router.get('/shop', function(req, res, next) {

if (req.query.bikeNameFromFront !== undefined){
  var alreadyExist = false;
  
  // Check the presence of an item in the basket
  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.bikeNameFromFront){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }
  // If item not exist => push new item in the basket
  if(alreadyExist == false){
    req.session.dataCardBike.push({
      name: req.query.bikeNameFromFront,
      url: req.query.bikeImageFromFront,
      price: req.query.bikePriceFromFront,
      quantity: 1
    })
  }
}
  res.render('shop', {dataCardBike:req.session.dataCardBike});
});

// Router for delete shop
router.get('/delete-shop', function(req, res, next){
  req.session.dataCardBike.splice(req.query.position,1)
  res.render('shop',{dataCardBike:req.session.dataCardBike})
})

// Router for update nb of items (modify nb of items by form (client side))
router.post('/update-shop', function(req, res, next){
  var position = req.body.position;
  var newQuantity = req.body.quantity;
  req.session.dataCardBike[position].quantity = newQuantity;
  // Return to the shop (basket with nb of items updated)
  res.render('shop',{dataCardBike:req.session.dataCardBike})
})

// Router for checkout
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51LBathATiV7YHkZmMISmG3J49HAS7qfDtcFpkaW0DgZEzKOzPLPSUFDWTZx5051dyFOs2AWWCqo9kfAxpFgnMPJJ008L95t0uF');

router.post('/create-checkout-session', async (req, res) => {
var totalItems = [];
var item = {};
  // Create the data for checkout (nb of items and unit's price)
for (let index = 0; index < req.session.dataCardBike.length; index++) {
item =
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.dataCardBike[index].name,
        },
        unit_amount: req.session.dataCardBike[index].price*100,
      },
      quantity: req.session.dataCardBike[index].quantity,
    }
    totalItems.push(item)
}

 const session = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
   line_items: totalItems,
   mode: 'payment',
   success_url: 'https://stormy-everglades-94002.herokuapp.com/success',
   cancel_url: 'https://stormy-everglades-94002.herokuapp.com/cancel',
 });

 res.redirect(303, session.url);
});

// Router Succes
router.get('/success', (req, res) => {
  res.render('success');
 });

// Router Cancel
router.get('/success', (req, res) => {
  res.render('cancel');
 });

module.exports = router;

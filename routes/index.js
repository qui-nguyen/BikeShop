var express = require("express");
var router = express.Router();

// Function
// Update basket's icon (nb total of items)
const basketIcon = (arrayData) => {
  let nbItems = 0;
  for (let index = 0; index < arrayData.length; index++) {
    nbItems += Number(arrayData[index].quantity);
  }
  return nbItems;
};
// Total basket no shipping fees
const totalBasketNoShip = (arrayData) => {
  let totalBasketHorsShip = 0;
  for (let index = 0; index < arrayData.length; index++) {
    totalBasketHorsShip +=
      Number(arrayData[index].quantity) * Number(arrayData[index].price);
  }
  return totalBasketHorsShip;
};

// Shipping fees (30euros/product)
const shipFeesUnit = 30;
// Shipping fees
const shipFees = (nbTotalItems, totalBasketHorsShip) => {
  let shippingFees = 0;
  shippingFees = nbTotalItems * shipFeesUnit;
  if (totalBasketHorsShip <= 2000) {
    shippingFees = shippingFees;
  } else if (totalBasketHorsShip > 2000 && totalBasketHorsShip <= 4000) {
    shippingFees = shippingFees / 2;
  } else {
    shippingFees = 0;
  }
  return shippingFees;
};

// Data of bikes
var dataBike = [
  { name: "BIK045", url: "/images/bike-1.jpg", price: 679, mea: true},
  { name: "ZOOK07", url: "/images/bike-2.jpg", price: 999, mea: false },
  { name: "TITANS", url: "/images/bike-3.jpg", price: 799, mea: false },
  { name: "CEWO", url: "/images/bike-4.jpg", price: 1300, mea: true },
  { name: "AMIG039", url: "/images/bike-5.jpg", price: 479, mea: true },
  { name: "LIK099", url: "/images/bike-6.jpg", price: 869, mea: false },
  { name: "SHIRO9", url: "/images/bike-4.jpg", price: 1869, mea: true },
  { name: "SHIMAP99", url: "/images/bike-2.jpg", price: 819, mea: true },
  { name: "SHIROU1", url: "/images/bike-1.jpg", price: 519, mea: true},
];

/* GET home page. */
router.get("/", function (req, res, next) {
  // Condition when basket is empty
  if (req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  res.render("index", {
    dataBike: dataBike,
    nbItems: basketIcon(req.session.dataCardBike),
  });
});

// Router basket page
router.get("/shop", function (req, res, next) {
  if (req.query.bikeNameFromFront !== undefined) {
    var alreadyExist = false;
    // Check the presence of an item in the basket
    for (var i = 0; i < req.session.dataCardBike.length; i++) {
      if (req.session.dataCardBike[i].name == req.query.bikeNameFromFront) {
        req.session.dataCardBike[i].quantity =
          Number(req.session.dataCardBike[i].quantity) + 1;
        alreadyExist = true;
      }
    }
    // If item not exist => push new item in the basket
    if (alreadyExist == false) {
      req.session.dataCardBike.push({
        name: req.query.bikeNameFromFront,
        url: req.query.bikeImageFromFront,
        price: req.query.bikePriceFromFront,
        quantity: 1,
      });
    }
  }

  let shippingFees = shipFees(
    basketIcon(req.session.dataCardBike),
    totalBasketNoShip(req.session.dataCardBike)
  );
  res.render("shop", {
    dataCardBike: req.session.dataCardBike,
    nbItems: basketIcon(req.session.dataCardBike),
    totalBasketNoShip: totalBasketNoShip(req.session.dataCardBike),
    shippingFees: shippingFees,
  });
});

// Router for delete shop
router.get("/delete-shop", function (req, res, next) {
  req.session.dataCardBike.splice(req.query.position, 1);
  let shippingFees = shipFees(
    basketIcon(req.session.dataCardBike),
    totalBasketNoShip(req.session.dataCardBike)
  );
  res.render("shop", {
    dataCardBike: req.session.dataCardBike,
    nbItems: basketIcon(req.session.dataCardBike),
    totalBasketNoShip: totalBasketNoShip(req.session.dataCardBike),
    shippingFees: shippingFees,
  });
});

// Router for update nb of items (modify nb of items by form (client side))
router.post("/update-shop", function (req, res, next) {
  var position = req.body.position;
  var newQuantity = req.body.quantity;
  req.session.dataCardBike[position].quantity = newQuantity;

  let shippingFees = shipFees(
    basketIcon(req.session.dataCardBike),
    totalBasketNoShip(req.session.dataCardBike)
  );

  // Return to the shop (basket with nb of items updated)
  res.render("shop", {
    dataCardBike: req.session.dataCardBike,
    nbItems: basketIcon(req.session.dataCardBike),
    totalBasketNoShip: totalBasketNoShip(req.session.dataCardBike),
    shippingFees: shippingFees,
  });
});

// Router for checkout
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51LBathATiV7YHkZmMISmG3J49HAS7qfDtcFpkaW0DgZEzKOzPLPSUFDWTZx5051dyFOs2AWWCqo9kfAxpFgnMPJJ008L95t0uF"
);

router.post("/create-checkout-session", async (req, res) => {
  var totalItems = [];
  var item = {};
  var shipFeesStripe = {
    price_data: {
      currency: "eur",
      product_data: {
        name: "Shipping Fees",
      },
      unit_amount:
        shipFees(
          basketIcon(req.session.dataCardBike),
          totalBasketNoShip(req.session.dataCardBike)
        ) * 100,
    },
    quantity: 1,
  };
  // Push shipping fees like an item into item list for checkout
  totalItems.push(shipFeesStripe);

  // Create the data for checkout (nb of items and unit's price)
  for (let index = 0; index < req.session.dataCardBike.length; index++) {
    item = {
      price_data: {
        currency: "eur",
        product_data: {
          name: req.session.dataCardBike[index].name,
        },
        unit_amount: req.session.dataCardBike[index].price * 100,
      },
      quantity: req.session.dataCardBike[index].quantity,
    };
    totalItems.push(item);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: totalItems,
    mode: "payment",
    success_url: "https://stormy-everglades-94002.herokuapp.com/success",
    cancel_url: "https://stormy-everglades-94002.herokuapp.com/cancel",
  });

  res.redirect(303, session.url);
});

// Router Succes
router.get("/success", (req, res) => {
  res.render("success");
});

// Router Cancel
router.get("/success", (req, res) => {
  res.render("cancel");
});

module.exports = router;

const express = require("express");
const app = express();
const cors = require("cors");
const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');

const { updateDoc, doc, arrayUnion } = require("firebase/firestore");
require('dotenv').config();

const port = process.env.PORT || 8001;

const stripe = require("stripe")(process.env.STRIPE_KEY);

app.use(cors());
app.use(express.static("public"));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());


const fs = require('fs');
let rawdata = fs.readFileSync('/etc/secrets/clefs');
let serviceAccount = JSON.parse(rawdata);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.get('/', async (req, res) => {
  console.log('bonjour');
  // const userRef = db.collection('users').doc('qnA8y2uZaXa1e3g6PaEWl0eWT9E3');
  // try {
  //   await userRef.update({
  //     lastUpdate: new Date(),
  //     reservations: admin.firestore.FieldValue.arrayUnion("new reservation2"),
  //   });
  //   console.log('bonjour2');
  // } catch (error) {
  //   console.error("Failed to update document:", error);
  // }
});

// app.get("/", (req, res) => res.type('html').send(html));

const calculateOrderAmount = (items) => {
  // console.log('key: ' + process.env.STRIPE_KEY);
  console.log('prix: ' + items[0].prix / 100)
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return items[0].prix;
};


app.post("/create-payment-intent", async (req, res) => {
  console.log("Paiement intent received", req.body);
  const { items, userId, reservationId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "cad",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      user_id: userId,
      reservation_id: reservationId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// webhook endpoint to receive events from Stripe 
app.post("/webhook", express.raw({ type: 'application/json' }), async (request, response) => {
  console.log("webhook received");
  console.log("sig: " + request.headers['stripe-signature']);
  const sig = request.headers['stripe-signature'];
  // console.log("webhook received après sig");
  // console.log("event: " + request.body);



  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }


// Handle the event
switch (event.type) {
  case 'payment_intent.amount_capturable_updated':
    const paymentIntentAmountCapturableUpdated = event.data.object;
    console.log('payment_intent.amount_capturable_updated');
    // Then define and call a function to handle the event payment_intent.amount_capturable_updated
    break;
  case 'payment_intent.canceled':
    const paymentIntentCanceled = event.data.object;
    console.log('payment_intent.canceled');
    // Then define and call a function to handle the event payment_intent.canceled
    break;
  case 'payment_intent.created':
    const paymentIntentCreated = event.data.object;
    console.log('payment_intent.created');
    // Then define and call a function to handle the event payment_intent.created
    break;
  case 'payment_intent.partially_funded':
    const paymentIntentPartiallyFunded = event.data.object;
    console.log('payment_intent.partially_funded');
    // Then define and call a function to handle the event payment_intent.partially_funded
    break;
  case 'payment_intent.payment_failed':
    const paymentIntentPaymentFailed = event.data.object;
    console.log('payment_intent.payment_failed');
    // Then define and call a function to handle the event payment_intent.payment_failed
    break;
  case 'payment_intent.processing':
    const paymentIntentProcessing = event.data.object;
    console.log('payment_intent.processing');
    // Then define and call a function to handle the event payment_intent.processing
    break;
  case 'payment_intent.requires_action':
    const paymentIntentRequiresAction = event.data.object;
    console.log('payment_intent.requires_action');
    // Then define and call a function to handle the event payment_intent.requires_action
    break;
  case 'payment_intent.succeeded':
    const paymentIntentSucceeded = event.data.object;
    console.log(paymentIntentSucceeded);
    console.log('payment_intent.succeeded for :', paymentIntentSucceeded.metadata.user_id );
    console.log('reservation_id :', paymentIntentSucceeded.metadata.reservation_id );
    const userRef = db.collection('users').doc(paymentIntentSucceeded.metadata.user_id);
    try {
      await userRef.update({
        lastUpdate: new Date(),
        reservations: admin.firestore.FieldValue.arrayUnion(paymentIntentSucceeded.metadata.reservation_id),
      });
      console.log('bonjour2');
    } catch (error) {
      console.error("Failed to update document:", error);
    }
    // Then define and call a function to handle the event payment_intent.succeeded
    break;
  // ... handle other event types
  default:
    console.log(`Unhandled event type ${event.type}`);
}

  // Return a 200 response to acknowledge receipt of the event
  console.log('success' + event.type + ' ' + event.data.object.id + ' ' + response.statusMessage);
  response.send();
});



const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render !!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!!
    </section>
  </body>
</html>
`

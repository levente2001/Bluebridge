const express = require('express');
const stripe = require('stripe')('sk_test_51Ngx5MFkBFBAJ31Es7NCOescEvQx2bj944N0rAJKI0Z92mK7RpHCDTNiv8b6YIIUePmSXCqhioD7ESyPzw1yRuw0002kuAFqBv');
const cors = require('cors');

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/create-customer-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'http://localhost:3000/account', // Replace with your return URL
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

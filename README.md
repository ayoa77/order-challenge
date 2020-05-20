# Order Challenge

By [Ayo Amadi](mailto:ayodeleamadi@gmail.com)

[ayo.works](https://ayo.works)

Publicly exposed api -

[https://ayo.works/orders](https://ayo.works/orders)

## Prerequisites

Below is the tech used to Develop and Test this.
It may not be necessary to use the same versions,
when running this on your own service.
but I can only guarantee the following ->

1. [Node v12](https://nodejs.org/en/)
2. [MongoDB v4](https://www.mongodb.com/)

## Instructions

1. Navigate to [repo](https://github.com/ayoa77/order-challenge)
2. Clone locally using
   `git clone https://github.com/ayoa77/order-challenge.git`
3. Install dependencies using `npm install`
4. Add your own .env file with MONGO_URI, MONGO_URI_TEST, PORT, with your own variables
5. Run a test server using `npm run start:test`
6. Start your test using `npm run test`
7. Start a development server `npm run start:dev`
8. Navigate to app in [browser](http://localhost:8080) to get your hello world
9. Use PostMan curl or any another preferred method to make the requests
   to http://localhost:8080/orders possible requests are [here](https://github.com/bypasslane/api-code-challenge/blob/master/orders_api.yaml)
10. Enjoy!

## Discussion

I used the following technologies: Nest.JS(Node.JS, Express, TypeScript), Mongoose, Jest, and Supertest.
I used [NEST CLI](https://docs.nestjs.com/cli/overview)
to generate the scaffolding for this app. I also used this opportunity to improve my knowledge
of TypeScript and Nest.JS as a framework. 

I intended on using this time to improve on testing as well, but that did not go as well due to
Nest.JS being rather young for a framework and lack of documentation for testing with mongoose. 
After spending more time than I would have liked attempting to test the Nest way with 
its compilation of a test module and then injection of a self-written mock, I decided to test 
in a more straight forward way. I skipped the net way injected the actual orderModel. 
I then created a connection to a test database and tested mockFunctions against the results
from my actual functions. However, these mockFunctions could be more flexible and allow for 
more refactoring in the actual funcitons. 

## Requirements

#### Build a simple POS system that accepts orders with line items, discounts, and taxes.
#### [Order API Challenge](https://github.com/bypasslane/api-code-challenge)

- [x] Creating an Order   POST /orders
- [x] Getting an Order   GET /orders/:uuid
- [x] Adding a LineItem to an Order   PUT /orders/:uuid
- [x] Adding a Discount to an Order   PUT /orders/:uuid
- [x] Editing a LineItem for an Order   PUT /orders/:uuid
- [x] Editing a Discount for an Order   PUT /orders/:uuid
- [x] Calculating Tax on an Order   
- [x] Calculating the total of an Order

Successfully made the orders calculate in the given order - from Order Discounts,
to Line Item Discounts, and Taxes. 

I would however argue that it should be Percent Order Discounts, Line Item Discounts,
Amount Order Discounts, and then Taxes. However, there was supporting evidence for
both sides of this, so I went ahead and coded it out the way that the task asked.

The yaml also doesn't contain some of the proper respsonse ie 404 for a get. These are 
all working properly if your test suite needs to have these removed for some reason,
let me know and I can do that rather quickly.

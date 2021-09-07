## Prerequisites

[Install docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-fr)

[Install docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-fr)

## Getting Started :rocket:

### Run it

````aidl
git clone https://github.com/sahar-fehri/express-booking.git
````

````aidl
docker-compose up
````

### Test it

Under postman folder you will find the environment and the collection to import into your postman.


Download the environment and collection:

````aidl
curl https://raw.githubusercontent.com/sahar-fehri/express-booking/main/postman/booking.postman_environment.json > booking.postman_environment.json
````

````aidl
curl https://raw.githubusercontent.com/sahar-fehri/express-booking/main/postman/booking.postman_collection.json > booking.postman_collection.json
````

Import the collection and for the env change the ip to put your own IP.

Finally you should have a total of 5 endpoints.

#### Scenario to test

`We suppose that room ids will go from 0 to 19 and the timestamps will come fromt the frontend, but for the sake of testing we wont use real timestamps.`

1. Register a user by entering for example:

    name: sam

    email: sam@gmail.com

    password: 123

    company: cola

2. Login the user by entering:

    email: sam@gmail.com

    password: 123

3. Book a room with id:0 from 8AM to 9AM by sam:

    resource: 0

    from: 8

    to: 9

Should be successful

3. Book same room with id:0 from 8AM to 9AM by sam:

    resource: 0

    from: 8

    to: 9

Should fail with error text 'AlreadyBooked'

4. Book another room with id:2 from 11AM to 12 by sam:

    resource: 2

    from: 11

    to: 12

Should be successful

5. Check availibilities (Should find two booked rooms)

6. Book another same room with id:2 from 11AM to 13AM ny sam

    resource: 2

    from: 11

    to: 13

Should fail with error text 'Slot Already Booked'

7. Register another user:

   name: elon

    email: elon@gmail.com

    password: 123

    company: pepsi

8. Login the user by entering:

    email: elon@gmail.com

    password: 123

9. Cancel room already booked by sam with id:2 from 11AM to 12 by sam:

    resource: 2

    from: 11

    to: 13

Should fail with errortext 'You did not book this slot'

You can try to book/cancel different slots and check the availibility.

If you try booking 10 different rooms with users from only cola for exp the 11th booking should fail.


Happy testing 😁 🎉
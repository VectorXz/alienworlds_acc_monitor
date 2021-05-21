# :heavy_check_mark: Server is now live! [21-5-2021 10:30 GMT+7]

# :page_with_curl: Updates on Server

## :bangbang: Bandwidth limit reaches on morning of 21 May 2021 (+7)

![image](https://user-images.githubusercontent.com/9075013/119078257-0aedab80-ba20-11eb-93e7-619f8b08d98f.png)

**I want to thank you to everyone that instested in this project.**
However, I did not expected that massive amount of requests by using this service.
That's why the service provider(that I hosted website on) suspended our website due to the limit exceeded.

### :warning: Cause of the limit exceeds
Since the website update frequently every 60 secs to serve the most realtime status of the Alienworlds Account, this also generate huge amount of traffic to the api server, then users may get banned sometimes and CORS policy problem also raised.

I decided to publish the middleware-api through the server, to reduce those problems, it works like a proxy to pass through user request to the API server.
However, the users is much more than I expected and those generate up to 8TB requests/hours and exceeding the limits.

## :ballot_box_with_check: Solution

I decided to deploy a new cloud instance to handle more requests and also accepts more traffic through the server, which cost around $5/month.

I also changed the way that service calling API requests, by now I will put that all work to client side first and disabled use of middleware-api.

I planned to design the new way of calling API to serve the best performance and mitigate number of errors, please stay tune!

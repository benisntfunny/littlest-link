<!-- @format -->

# littlest.link

I didn't want to pay for a URL shortening service so this is a simple set of endpoints to shorten a URL and then redirect from the shortened URL.

### Requires .env file at the root with

API_KEY - Anything you want
DOMAIN_NAME - A route53 domain name that you will use for your shortening service.

#### Example

API_KEY=ABC1234aaaaaa1
DOMAIN_NAME=littlest.link

### Other info to know

1. Yes this could be done with one table.
2. The permissions are loose.
3. I'm sure there's more robust versions of this out there.

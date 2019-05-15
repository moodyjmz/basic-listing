# \<basic-demo\>

Basic demo coupling two instances of `iron-list` and a filter together.

Loads country and flag information in and ties together.

Uses virtualised listing and attempts to mitigate the repeated image loading.

Main code is in the `src` dir.

`demo-countries` fetches country list from `iso-countries` and connects it to the flag img resources. It also caches flag images as they are used.

`demo-app` pulls the elements together and establishes bindings etc

`demo-country-item` is used within the `iron-list` template to display the item data.

*TODO selection persistence when filter is applied*

This is just to experiment with iron-list.

The image caching bit is not really a good idea and just done because.... meh, can't cach and just wanted to see what happened.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Viewing Your Application

```
$ polymer serve
```


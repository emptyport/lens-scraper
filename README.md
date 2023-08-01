# My Lenses scraper

This is a simple scraper for [My Lenses](https://my-lenses.snapchat.com) to retrieve data about your Snapchat lenses. I used it to retrieve info about my lenses to then download all the preview videos and snapcodes.

Additionally there is a script you can use to enable Creator Rewards for all your lenses.

## Usage

> This does require some programming knowledge to run.

1. Clone this repository
2. Install Nodejs v18 or higher
3. Run `npm install` in the cloned directory
4. Create a file called `.env` in the cloned directory with the following contents:

```
MY_LENSES_AUTHORIZATION=
MY_LENSES_COOKIE=
```

5. Go to [My Lenses](https://my-lenses.snapchat.com) and log in
6. Open the developer tools and go to the network tab
7. Click on a lens to go to its page
8. In the network tab, find a `graphql` call and verify the endpoint was `https://my-lenses.snapchat.com/graphql`
9. Find the `Authorization` and `Cookie` request (not response) headers and copy the values to the .env file. There should not be a space after the equals sign.

```
MY_LENSES_AUTHORIZATION=Bearer abc...
MY_LENSES_COOKIE=cookie1=abc; cookie2=def
```

10. Run `node fetchLensData.mjs` to download all your lens data. This will create a `lenses.json` file in the cloned directory. It will only grab community lenses which are set to public, but please spot-check the file to make sure it looks correct.
11. Run `node enableCreatorRewards.mjs` to enable Creator Rewards for all your lenses. This will take a while, but it will print out the status of each lens as it goes.
12. Go back to My Lenses and refresh the page. All your lenses should now be in processing or review states.

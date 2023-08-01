import "dotenv/config";
import fetch from "node-fetch";
import fs from "fs";

const lensJson = JSON.parse(fs.readFileSync("./lenses.json", "utf8"));

const query = `
mutation setLensCreatorPayoutEnrollment(
    $lensId: ID!
    $lensCreatorPayoutEnrolled: Boolean!
  ) {
    setLensCreatorPayoutEnrollment(
      input: {
        lensId: $lensId
        lensCreatorPayoutEnrolled: $lensCreatorPayoutEnrolled
      }
    ) {
      lens {
        id
        lensCreatorPayoutEligibility
        status
        __typename
      }
      __typename
    }
  }
  `;

const url = "https://my-lenses.snapchat.com/graphql";

const headers = {
    Authorization: process.env.MY_LENSES_AUTHORIZATION,
    Cookie: process.env.MY_LENSES_COOKIE,
    "Content-Type": "application/json",
};

const enableRewards = async () => {
    for (const lens of lensJson) {
        const { id } = lens;

        console.log("Enabling creator rewards for lens " + id);

        const variables = {
            lensId: id,
            lensCreatorPayoutEnrolled: true,
        };

        const options = {
            method: "POST",
            headers,
            body: JSON.stringify({ query, variables }),
        };
        const res = await fetch(url, options);
        const { data } = await res.json();
        console.log(data);
    }
};

enableRewards();

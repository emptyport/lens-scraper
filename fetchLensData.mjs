import "dotenv/config";
import fetch from "node-fetch";
import fs from "fs";

const query = `query getLensesList(
    $limit: Int!
    $offset: Int!
    $sortBy: SortBy!
    $sortDirection: SortDirection!
    $filterBy: FilterBy
    $organizationId: ID
    $adAccountId: ID
    $profileId: ID
    $lensSpaceId: ID
    $type: GetLensesType!
  ) {
    lenses: getLenses(
      input: {
        limit: $limit
        offset: $offset
        sortBy: $sortBy
        sortDirection: $sortDirection
        filterBy: $filterBy
        organizationId: $organizationId
        adAccountId: $adAccountId
        profileId: $profileId
        lensSpaceId: $lensSpaceId
        type: $type
      }
    ) {
      lensesList {
        ...Lens
        __typename
      }
      __typename
    }
  }
  fragment Lens on Lens {
    id
    name
    iconUrl
    previewUrl
    tagsList
    scanTriggersList
    visibility
    status
    distributionsList {
      destinationId
      destinationType
      __typename
    }
    updatedAt {
      nanos
      seconds
      __typename
    }
    updatedBy
    snapcode {
      imageUrl
      deeplink
      expiresAt {
        nanos
        seconds
        __typename
      }
      isTemporary
      __typename
    }
    primaryCategoryId
    secondaryCategoryId
    discoverability {
      tagsList
      description
      locationsList
      daysTimesHolidaysList
      __typename
    }
  }
  `;

const variables = {
    limit: 20,
    offset: 0,
    sortBy: "SORT_BY_DATE",
    sortDirection: "SORT_DIRECTION_DESC",
    filterBy: {
        statusList: ["LENS_STATUS_LIVE"],
        lockedList: [],
        nameList: [],
        unlockableIdList: [],
    },
    organizationId: "",
    type: "COMMUNITY",
};

const url = "https://my-lenses.snapchat.com/graphql";

const headers = {
    Authorization: process.env.MY_LENSES_AUTHORIZATION,
    Cookie: process.env.MY_LENSES_COOKIE,
    "Content-Type": "application/json",
};

let lensList = [];

let batch = 0;
let offset = 0;

const getLenses = async () => {
    const options = {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
    };

    const res = await fetch(url, options);
    const { data } = await res.json();
    const { lenses } = data;
    const { lensesList } = lenses;
    const length = lensesList.length;
    if (length > 0) {
        batch++;
        offset += length;
        console.log(`Batch ${batch} - ${offset} lenses fetched`);
        lensList.push(...lensesList);
        variables.offset = offset;
        await getLenses();
    } else {
        console.log("All lenses fetched");
        console.log(`Total lenses: ${lensList.length}`);
        fs.writeFileSync("./lenses.json", JSON.stringify(lensList));
    }
};

getLenses();

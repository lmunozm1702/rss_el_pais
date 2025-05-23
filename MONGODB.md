# 🔄 Connecting RSS El País to MongoDB Atlas

<img src="https://webimages.mongodb.com/_com_assets/cms/kuzt9r42or1fxvlq2-Meta_Generic.png" alt="MongoDB Atlas Logo" width="150" />

This document provides a step-by-step guide on how to connect our El País RSS aggregator to MongoDB Atlas, a fully-managed cloud database service.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating a MongoDB Atlas Account](#creating-a-mongodb-atlas-account)
3. [Setting Up a New Cluster](#setting-up-a-new-cluster)
4. [Configuring User and Network Access](#configuring-user-and-network-access)
5. [Getting the Connection String](#getting-the-connection-string)
6. [Integrating with Our Project](#integrating-with-our-project)
7. [Verifying the Connection](#verifying-the-connection)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Prerequisites

Before starting, make sure you have:

- The RSS El País project downloaded and running locally
- Node.js and npm installed
- A stable internet connection
- A modern web browser

## Creating a MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.

   ![MongoDB Atlas Registration Page](/assets/images/mongo_register.png)

2. Complete the form with your information or sign up with Google.

3. On the welcome page, select "Create a project".

   ![Welcome Page](/assets/images/mongo_create_project.png)

## Setting Up a New Cluster

1. Select the free tier plan ("FREE") to get started.

   ![Plan Selection](/assets/images/mongo_select_plan.png)

2. Choose your cloud provider (AWS, Google Cloud, or Azure) and the region closest to you for better latency.

   ![Provider Selection](/assets/images/mongo_select_provider.png)

3. At the bottom, name your cluster (e.g., "RssElPaisCluster").

4. Click "Create" to start creating your cluster (this may take a few minutes).

## Configuring User and Connection Type

1. While the cluster is being created, you'll be prompted to set up a database user:

   - Username: Choose a name (e.g., "rss_admin")
   - Password: Generate a secure password or use the suggested one
   - User Role: Atlas admin

   ![User Creation](/assets/images/mongo_create_db_user.png)

2. Select how to connect the application:

- Driver: Node.js
- Version: 6.7 or later

  ![Choose Connection](/assets/images/mongo_choose_connection.png)

3. Install the driver into the project

   ```bash
   npm install mongodb
   ```

4. Copy the provided connection string. It will look something like:

   ```
   mongodb+srv://rss_admin:<password>@elpaiscluster.gfbb608.mongodb.net/?retryWrites=true&w=majority&appName=ElPaisCluster
   ```

5. **Important**: Replace `<password>` with the password you set for your user.

## Integrating with Our Project

1. Create a `.env` file in the root of your project to store the connection string:

   ```bash
   touch .env
   ```

2. Add the connection string to your `.env` file:

   ```
   MONGODB_URI=mongodb+srv://rss_admin:<password>@elpaiscluster.gfbb608.mongodb.net/?retryWrites=true&w=majority&appName=ElPaisCluster
   ```

3. Install dotenv to load environment variables:

   ```bash
   npm install dotenv
   ```

4. Install required packages, axios for HTTP requests and xml2js for XML parsing:

   ```bash
   npm install axios xml2js && npm install --save-dev @types/xml2js
   ```

5. Modify your `src/index.ts` file to use the MongoDB Atlas connection:

```typescript
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import axios from "axios";
import * as xml2js from "xml2js";

// Load environment variables
dotenv.config();

// Interfaces for RSS response typing
interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  // Add more properties based on El País RSS structure
}

/**
 * Fetches and parses RSS content from a URL
 */
async function fetchRSS(url: string): Promise<RSSItem[]> {
  try {
    console.log(`Fetching RSS from: ${url}`);

    // Make HTTP request to get XML
    const response = await axios.get(url);

    // Configure parser
    const parser = new xml2js.Parser({
      explicitArray: false,
      normalize: true,
      normalizeTags: true,
    });

    // Parse XML to JavaScript object
    const result = await parser.parseStringPromise(response.data);

    // Extract RSS items
    const channel = result.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    return items;
  } catch (error) {
    console.error("Error fetching RSS:", error);
    throw error;
  }
}

/**
 * Saves articles to MongoDB Atlas
 */
async function saveArticles(articles: RSSItem[]): Promise<void> {
  // Verify we have the connection URI
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  const client = new MongoClient(uri);

  try {
    // Connect to the client
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Select database and collection
    const database = client.db("rss_el_pais");
    const collection = database.collection("articles");

    // Prepare articles for insertion (adding timestamp)
    const articlesWithTimestamp = articles.map((article) => ({
      ...article,
      importedAt: new Date(),
      _id: article.guid, // Use guid as unique ID
    }));

    // Insert or update articles one by one (upsert)
    for (const article of articlesWithTimestamp) {
      const result = await collection.updateOne(
        { _id: article._id },
        { $set: article },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        console.log(`New article added: ${article.title}`);
      } else if (result.modifiedCount > 0) {
        console.log(`Article updated: ${article.title}`);
      } else {
        console.log(`Article unchanged: ${article.title}`);
      }
    }

    console.log(`Processing completed. ${articles.length} articles processed.`);
  } finally {
    // Close the connection when we're done
    await client.close();
    console.log("MongoDB Atlas connection closed");
  }
}

/**
 * Main function
 */
async function main() {
  const urlElPais =
    "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada";

  try {
    console.log("RSS El País project started");

    // Fetch and parse RSS
    const articles = await fetchRSS(urlElPais);
    console.log(`Retrieved ${articles.length} articles from RSS`);

    // Save to MongoDB Atlas
    await saveArticles(articles);
  } catch (error) {
    console.error("Application error:", error);
  }
}

// Run the main function
main().catch((error) => console.error("General error:", error));
```

## Verifying the Connection

To verify that everything is working correctly:

1. Run your application:

   ```bash
   npm run dev
   ```

2. You should see successful connection messages and article processing:

   ```
   RSS El País project started
   Fetching RSS from: https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada
   Retrieved 25 articles from RSS
   Connected to MongoDB Atlas
   New article added: [Article Title]
   ...
   Processing completed. 25 articles processed.
   MongoDB Atlas connection closed
   ```

3. Verify the data in MongoDB Atlas:

   - Return to the Atlas dashboard
   - Click on "Browse Collections"
   - Select the "rss_el_pais" database and "articles" collection
   - You should see the stored articles

   ![Browse Collections](https://i.imgur.com/ZKQ2h80.png)

## Troubleshooting Common Issues

### Connection Error

**Problem**: `MongoServerSelectionError: connection <monitor> to <host> closed`

**Solution**:

- Verify that your IP address is whitelisted
- Make sure the password in the URI is correct

### Authentication Error

**Problem**: `MongoServerError: Authentication failed`

**Solution**:

- Check username and password
- Ensure there are no unencoded special characters in the URI

### Index Creation Error

**Problem**: `MongoError: not authorized on admin to execute command`

**Solution**:

- Check that the user has proper permissions
- You may need to create a database-specific user

---

## 🎉 Done!

Your RSS El País application is now connected to MongoDB Atlas. Your articles will be securely stored in the cloud and accessible from anywhere.

If you have additional questions, feel free to contact me:

- [GitHub](https://github.com/lmunozm1702)
- [LinkedIn](https://www.linkedin.com/in/l-munoz-m/)
- [Email](mailto:l.munoz.m@outlook.com)

Happy coding! 📰🚀

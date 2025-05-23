import * as dotenv from "dotenv";
import { MongoClient, Document } from "mongodb";
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

// Interface for database document
interface ArticleDocument extends Document {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  importedAt: Date;
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
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db("rss_el_pais");
    const collection = database.collection<ArticleDocument>("articles");

    // Prepare articles for insertion (adding timestamp)
    const articlesWithTimestamp = articles.map((article) => ({
      ...article,
      importedAt: new Date(),
    }));

    // Insert or update articles using guid as the unique identifier
    for (const article of articlesWithTimestamp) {
      const result = await collection.updateOne(
        { guid: article.guid }, // Usar guid como criterio de búsqueda
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

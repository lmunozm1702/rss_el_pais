# 📰 RSS El País Aggregator

**Slurp up the latest news from El País into your MongoDB database!**

![RSS Feed Animation](https://media.giphy.com/media/3oKIPzLXQYb2Bn5PLG/giphy.gif)

## 🚀 What's This?

This project grabs the latest news from El País (one of Spain's major newspapers) via their RSS feed and neatly tucks them into a MongoDB database. Perfect for:

- Creating your personal news archive
- Data analysis on news trends
- Building custom news dashboards
- Practicing your TypeScript & MongoDB skills
- Impressing friends with your ability to fetch news programmatically!

## 🛠️ Tech Stack

- **TypeScript** - For that delightful type safety
- **Node.js** - Running the JavaScript engine
- **MongoDB** - Where all those juicy articles will live
- **Axios** - For fetching RSS feeds like a boss
- **xml2js** - Converting XML to beautiful JS objects
- **ESLint & Prettier** - Keeping our code looking sharp

## 🏁 Quick Start

Clone this magnificent repository:

```bash
git clone https://github.com/lmunozm1702/rss_el_pais.git
cd rss_el_pais
```

Install dependencies (it's raining packages!):

```bash
npm install
```

Run in development mode (instant gratification):

```bash
npm run dev
```

Or if you're old-school, build and then run:

```bash
npm run build
npm start
```

## 🧙‍♂️ Available Commands

This project comes with magical incantations:

- `npm run build` - Transforms TypeScript into JavaScript sorcery
- `npm start` - Runs the compiled JavaScript
- `npm run dev` - Runs directly with ts-node (skip compilation for faster development)
- `npm run lint` - Checks for code style issues
- `npm run lint:fix` - Automatically fixes code style issues
- `npm run prettier` - Makes your code look gorgeous
- `npm run prettier:check` - Checks if your code is already gorgeous

## 📋 Project Structure

```
rss_el_pais/
├── src/               # Where the magic happens
│   └── index.ts       # The entry point to our application
├── .eslintrc.js       # ESLint configuration
├── .gitignore         # Files to ignore in Git
├── .prettierrc.json   # Prettier configuration
├── package.json       # Project metadata and dependencies
├── package-lock.json  # Exact dependency versions
└── tsconfig.json      # TypeScript configuration
```

## 🔮 Future Enhancements

- Add scheduling to fetch RSS at regular intervals
- Implement full-text search on stored articles
- Create a web interface to browse your news archive
- Add sentiment analysis on headlines
- Email notifications for articles matching keywords
- World domination (pending)

## 👨‍💻 Author

**Luis Muñoz**

A passionate developer with a knack for automating the mundane and making data work for you!

- [GitHub](https://github.com/lmunozm1702)
- [LinkedIn](https://www.linkedin.com/in/l-munoz-m/)
- [Email](mailto:l.munoz.m@outlook.com)

Feel free to reach out for questions, suggestions, or just to chat about how you're using this project!

## 📝 License

This project is licensed under the ISC License - see the license section in `package.json` for details.

## 🤔 Why This Project?

Because manually checking news websites is _so_ 2005. Let automation do the work while you focus on more important things, like deciding which coffee to drink while your script fetches the news for you.

## 🚧 Disclaimer

This project is not affiliated with El País. Please respect their terms of service when using their RSS feeds.

---

_"The news never sleeps, but with this script, at least you can."_ - Luis Muñoz

Happy news collecting! 📚✨

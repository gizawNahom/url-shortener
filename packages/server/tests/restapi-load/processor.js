module.exports = {
  addToShortenedPathNames: (requestParams, response, context, ee, next) => {
    if (!context.vars.shortenedPathNames) context.vars.shortenedPathNames = [];
    context.vars.shortenedPathNames.push(
      new URL(context.vars.shortUrl).pathname
    );
    return next();
  },
  pickShortenedPathName: (context, ee, next) => {
    const shortenedPathNames = context.vars.shortenedPathNames;
    const index = Math.floor(Math.random() * shortenedPathNames.length);
    context.vars.shortenedPathName = shortenedPathNames[index];
    return next();
  },
};

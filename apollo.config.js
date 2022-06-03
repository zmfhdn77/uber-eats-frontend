module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "uber-eats-backend",
      url: "https://zmfhdn-uber-eats-clone-backend.herokuapp.com/graphql",
    },
  }, // highlight-line
};

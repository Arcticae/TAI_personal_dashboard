// Params checking utils functions
const Params = {
  //Check if object is empty string, empty array or empty object
  isEmpty: item =>
    item === undefined ||
    item === null ||
    (typeof item === "object" &&
      (item === "" || item.length === 0 || Object.keys(item).length === 0))
};

module.exports = Params;

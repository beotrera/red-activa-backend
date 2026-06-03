/** Receive an object and remove attributes that are undefined or empty string */
const deleteObjectUndefined = <T extends object>(object: T) => {
  Object.keys(object).forEach((key) =>
    object[key] === undefined || object[key] === '' ? delete object[key] : '',
  );
};

export const deleteObjectUtils = { deleteObjectUndefined };

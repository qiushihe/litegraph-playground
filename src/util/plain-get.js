import isEmpty from "lodash/fp/isEmpty";
import split from "lodash/fp/split";

const plainGet = (path) => {
  const _get = (fragments, obj) => {
    const [fragment, ...restFragments] = fragments;

    return isEmpty(restFragments)
      ? obj[fragment]
      : _get(restFragments, obj[fragment] || {});
  };

  return (obj) => _get(split(".")(path), obj);
};

export default plainGet;

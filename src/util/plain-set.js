import isEmpty from "lodash/fp/isEmpty";
import split from "lodash/fp/split";

const plainSet = (path, value) => {
  const _set = (fragments, obj) => {
    const [fragment, ...restFragments] = fragments;

    return isEmpty(restFragments)
      ? {
          ...obj,
          [fragment]: value
        }
      : {
          ...obj,
          [fragment]: _set(restFragments, obj[fragment] || {})
        };
  };

  return (obj) => _set(split(".")(path), obj);
};

export default plainSet;

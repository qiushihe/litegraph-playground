import isEmpty from "lodash/fp/isEmpty";
import split from "lodash/fp/split";

const plainSet = (path: string, value: unknown) => {
  const _set = (fragments: string[], obj: Record<string, unknown>): unknown => {
    const [fragment, ...restFragments] = fragments;

    return isEmpty(restFragments)
      ? {
          ...obj,
          [fragment]: value
        }
      : {
          ...obj,
          [fragment]: _set(
            restFragments,
            (obj[fragment] as Record<string, unknown>) || {}
          )
        };
  };

  return (obj: unknown) =>
    _set(split(".")(path), obj as Record<string, unknown>);
};

export default plainSet;

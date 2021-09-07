import isEmpty from "lodash/fp/isEmpty";
import split from "lodash/fp/split";

const plainGet = (path: string) => {
  const _get = (fragments: string[], obj: Record<string, unknown>): unknown => {
    const [fragment, ...restFragments] = fragments;

    return isEmpty(restFragments)
      ? obj[fragment]
      : _get(restFragments, (obj[fragment] as Record<string, unknown>) || {});
  };

  return (obj: unknown) =>
    _get(split(".")(path), obj as Record<string, unknown>);
};

export default plainGet;
